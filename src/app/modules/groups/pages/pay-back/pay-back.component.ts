import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { GroupWithMembers } from '@app/core/stores/groups/groups.selectors';
import { AuthActions } from '@app/core/stores/auth';
import { combineLatest, Observable } from 'rxjs';
import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { selectGroupWithMembersFromState } from '@app/core/stores/groups/groups.selectors';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take, filter, map } from 'rxjs/operators';
import { PaymentsSelectors } from '@app/core/stores/payments';
import { Payment, User } from '@app/core/models/interfaces';
import { CommonModule } from '@angular/common';

interface MemberWithPayments {
  user: User;
  payments: Payment[];
}

@Component({
  selector: 'app-pay-back',
  imports: [CommonModule],
  templateUrl: './pay-back.component.html',
  styleUrl: './pay-back.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayBackComponent implements OnInit {
  private groupId$ = this.store.select(selectGroupId);
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
  ]).pipe(
    map(([members, payments]) => {
      const membersWithPayments: MemberWithPayments[] = [];

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

        membersWithPayments.push({
          user,
          payments: filteredPayments,
        });
      }

      return membersWithPayments;
    }),
  );

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.groupId$.pipe(take(1)).subscribe((groupId) => {
      // Get group
      if (groupId) {
        this.store.dispatch(GroupsActions.loadGroup({ groupId }));
      }
    });
  }
}
