import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { GroupWithMembers } from '@app/core/stores/groups/groups.selectors';
import { AuthActions, AuthSelectors } from '@app/core/stores/auth';
import { combineLatest, Observable } from 'rxjs';
import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { selectGroupWithMembersFromState } from '@app/core/stores/groups/groups.selectors';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take, filter, map, withLatestFrom } from 'rxjs/operators';
import { PaymentsActions, PaymentsSelectors } from '@app/core/stores/payments';
import {
  MemberWithPayments,
  Payment,
  User,
  Currency,
} from '@app/core/models/interfaces';
import { CommonModule } from '@angular/common';
import { OweCalculationComponent } from './owe-calculation/owe-calculation.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PayBackDialogComponent } from './pay-back-dialog/pay-back-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';

const COMPONENTS = [OweCalculationComponent];

const MUI = [MatDialogModule];

@Component({
  selector: 'app-pay-back',
  imports: [CommonModule, ...COMPONENTS, ...MUI],
  templateUrl: './pay-back.component.html',
  styleUrl: './pay-back.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayBackComponent implements OnInit {
  private groupId$ = this.store.select(selectGroupId);
  public userId$ = this.store.select(AuthSelectors.selectCurrentUserId);
  public group$ = this.groupId$.pipe(
    filter((groupId): groupId is string => groupId !== undefined),
    switchMap((groupId) =>
      this.store.select(GroupsSelectors.selectGroupById(groupId)),
    ),
  );
  public payments$ = this.groupId$.pipe(
    filter((groupId): groupId is string => groupId !== undefined),
    switchMap((groupId) =>
      this.store.select(
        PaymentsSelectors.selectPaymentsByGroupIdAndUserId(groupId),
      ),
    ),
  );
  public groupWithMembers$: Observable<GroupWithMembers> = this.group$.pipe(
    switchMap((group) => {
      if (!group) {
        const emptyGroup: GroupWithMembers = {
          id: '',
          name: '',
          members: [],
          totalSpent: 0,
          adminOwners: [],
          createdAt: Timestamp.now(),
        };
        return of(emptyGroup);
      }

      this.store.dispatch(
        AuthActions.loadUsersByIds({ userIds: group.members }),
      );
      return this.store.select(selectGroupWithMembersFromState(group));
    }),
  );
  public members$ = this.groupWithMembers$.pipe(
    map((group) => {
      const userMap = new Map<string, User>();
      group.members.forEach((member) => {
        userMap.set(member.id, member);
      });
      return userMap;
    }),
  );
  public membersWithPayments$ = combineLatest([
    this.members$,
    this.payments$,
    this.userId$,
  ]).pipe(
    map(([members, payments, userId]) => {
      const membersWithPayments: MemberWithPayments[] = [];
      if (!userId) {
        return membersWithPayments;
      }

      // For each payment, add the payment to the member's payments
      for (const key of Array.from(members.keys())) {
        const user = members.get(key);
        if (!user) {
          continue;
        }

        const filteredPayments = payments.filter((payment) => {
          const isPayer = payment.paidBy.some(
            (payer) => payer.memberId === key,
          );
          const isPayee = payment.splits.some(
            (split) => split.memberId === key,
          );
          return isPayer || isPayee;
        });

        // Get the first currency code from the payments
        const currencyCode =
          filteredPayments.length > 0 ? filteredPayments[0].currency : 'USD';

        // Calculate the balance
        const balance = this.handleBalanceCalculation(
          userId,
          key,
          filteredPayments,
        );

        if (balance === 0) {
          continue;
        }

        membersWithPayments.push({
          user,
          payments: filteredPayments,
          balance,
          currencyCode,
        });
      }

      return membersWithPayments;
    }),
  );

  constructor(private store: Store, private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.groupId$.pipe(take(1)).subscribe((groupId) => {
      // Get group
      if (groupId) {
        this.store.dispatch(GroupsActions.loadGroup({ groupId }));
      }
    });
  }

  public onPayBackClick(member: MemberWithPayments): void {
    const dialogRef: MatDialogRef<
      PayBackDialogComponent,
      FormGroup<{
        currency: FormControl<Currency | null>;
        amount: FormControl<number | null>;
      }>
    > = this.dialog.open(PayBackDialogComponent, {
      data: member,
    });

    dialogRef
      .afterClosed()
      .pipe(withLatestFrom(this.groupId$, this.userId$))
      .subscribe(([result, groupId, userId]) => {
        if (!result || result.invalid) {
          return;
        }
        const formValue = result.getRawValue();

        const amountValue = formValue.amount || 0;
        const currencyValue = formValue.currency?.code || 'USD';

        const payerId = member.balance > 0 ? member.user.id : userId;

        const payeeId = member.balance > 0 ? userId : member.user.id;

        const payment: Omit<Payment, 'id'> = {
          amount: amountValue,
          currency: currencyValue,
          date: Timestamp.now(),
          paidBy: [
            {
              memberId: payerId || '',
              amount: amountValue,
            },
          ],
          paymentType: 'debt',
          groupId: groupId || '',
          description: 'Payment to pay back',
          category: 'Repayment',
          splitType: 'exact',
          splits: [
            {
              memberId: payeeId || '',
              value: amountValue,
            },
          ],
        };

        this.store.dispatch(PaymentsActions.createPayment({ payment }));
      });
  }

  private handleBalanceCalculation(
    currentUserId: string,
    memberId: string,
    payments: Payment[],
  ): number {
    let balance = 0;

    for (const payment of payments) {
      const totalPaid =
        payment.paidBy.reduce((sum, p) => sum + p.amount, 0) || 0;
      const payerMap = new Map(
        payment.paidBy.map((p) => [p.memberId, p.amount]),
      );

      for (const split of payment.splits) {
        const debtorId = split.memberId;
        const value = split.value;

        for (const [payerId, paidAmount] of payerMap.entries()) {
          if (payerId === debtorId) continue; // skip self-payment

          const share = (paidAmount / totalPaid) * value;

          const isCurrentUserPayer = payerId === currentUserId;
          const isMemberDebtor = debtorId === memberId;

          const isMemberPayer = payerId === memberId;
          const isCurrentUserDebtor = debtorId === currentUserId;

          // current user paid, member owes them
          if (isCurrentUserPayer && isMemberDebtor) {
            balance += share;
          }

          // member paid, current user owes them
          if (isMemberPayer && isCurrentUserDebtor) {
            balance -= share;
          }
        }
      }
    }

    return balance;
  }
}
