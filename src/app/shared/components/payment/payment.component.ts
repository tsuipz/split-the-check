import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExpenseComponent } from './expense/expense.component';
import { MatButtonModule } from '@angular/material/button';
import { PaymentFormService } from './payment.form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaidByComponent } from './paid-by/paid-by.component';
import { SplitWithComponent } from './split-with/split-with.component';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AuthActions } from '@app/core/stores/auth';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { AuthSelectors } from '@app/core/stores/auth';
import { Timestamp } from '@angular/fire/firestore';
import { GroupWithMembers } from '@app/core/stores/groups/groups.selectors';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentsActions } from '@app/core/stores/payments';

const COMPONENTS = [ExpenseComponent, PaidByComponent, SplitWithComponent];

const MUI = [MatProgressBarModule, MatButtonModule];

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ...MUI, ...COMPONENTS],
  providers: [PaymentFormService],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent implements OnInit {
  public form = this.paymentFormService.form;
  public progress: 30 | 60 | 90 | 100 = 30;

  public get nextBtnText() {
    if (this.progress === 90) {
      return 'Save';
    }

    return 'Next';
  }

  public get previousBtnText() {
    if (this.progress === 30) {
      return 'Cancel';
    }

    return 'Previous';
  }

  private groupId$ = this.store.select(selectGroupId);
  private group$ = this.groupId$.pipe(
    filter((groupId): groupId is string => groupId !== undefined),
    switchMap((groupId) =>
      this.store.select(GroupsSelectors.selectGroupById(groupId)),
    ),
  );
  private user$ = this.store.select(AuthSelectors.selectCurrentUserId);
  private groupWithMembers$: Observable<GroupWithMembers> = this.group$.pipe(
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
      return this.store.select(
        GroupsSelectors.selectGroupWithMembersFromState(group),
      );
    }),
  );
  public members$ = this.groupWithMembers$.pipe(map((group) => group.members));

  constructor(
    private paymentFormService: PaymentFormService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.groupId$.pipe(take(1)).subscribe((groupId) => {
      if (groupId) {
        this.store.dispatch(GroupsActions.loadGroup({ groupId }));
      } else {
        this.router.navigate(['/groups']);
      }
    });

    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((userId) => {
      if (userId) {
        this.form.controls.paidBy.patchValue({
          singlePayer: [userId],
        });
      }
    });

    this.members$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((members) => {
        this.paymentFormService.onSetupMultiplePayers(members);
        this.paymentFormService.onSetupSplitMembers(members);
      });

    this.form.controls.paidBy.controls.payerByType.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.paymentFormService.onIsHideMultiplePayers();
      });
  }

  nextStep() {
    const expense = this.form.controls.expense;
    const paidBy = this.form.controls.paidBy;
    const splitWith = this.form.controls.splitWith;
    if (this.progress === 30) {
      expense.markAsDirty();

      if (expense.valid) {
        this.progress = 60;
      }
    } else if (this.progress === 60) {
      paidBy.markAsDirty();

      if (paidBy.valid) {
        this.progress = 90;
      }
    } else if (this.progress === 90) {
      splitWith.markAsDirty();

      if (splitWith.valid) {
        this.groupId$.pipe(take(1)).subscribe((groupId) => {
          if (groupId) {
            const payment = this.paymentFormService.onSubmit(groupId);

            this.store.dispatch(PaymentsActions.createPayment({ payment }));

            this.router.navigate(['..'], {
              relativeTo: this.activatedRoute,
            });
          }
        });
      }
    }
  }

  previousStep() {
    if (this.progress === 30) {
      this.router.navigate(['..'], { relativeTo: this.activatedRoute });
    } else if (this.progress === 60) {
      this.progress = 30;
    } else if (this.progress === 90) {
      this.progress = 60;
    }
  }
}
