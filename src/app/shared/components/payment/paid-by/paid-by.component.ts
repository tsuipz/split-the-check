import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  DestroyRef,
  signal,
  Input,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { GroupWithMembers } from '@app/core/stores/groups/groups.selectors';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { AuthActions, AuthSelectors } from '@app/core/stores/auth';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Currency } from '@app/core/models/interfaces';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MultiplePayersFormGroup,
  PaidByForm,
  PaymentFormService,
} from '../payment.form.service';

const MUI = [
  MatButtonToggleModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
];

@Component({
  selector: 'app-paid-by',
  imports: [CommonModule, ReactiveFormsModule, ...MUI],
  templateUrl: './paid-by.component.html',
  styleUrl: './paid-by.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaidByComponent implements OnInit {
  @Input() form = this.fb.group<PaidByForm>({
    payerByType: this.fb.control('single'), // single, multiple
    singlePayer: this.fb.control(null),
    multiplePayers: this.fb.array<MultiplePayersFormGroup>([]),
  });
  @Input() currency = this.fb.control<Currency | null>({
    code: 'USD',
    symbol: '$',
    label: 'United States Dollar',
  });
  @Input() amount = this.fb.control<number | null>(100);

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
  public multiplePayersErrorSignal = signal('');

  public get sumAmount() {
    return this.form.controls.multiplePayers.value.reduce(
      (acc, payer) => acc + (payer.amount ?? 0),
      0,
    );
  }

  public get amountLeft() {
    return this.amount.value ? this.amount.value - this.sumAmount : 0;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private destroyRef: DestroyRef,
    private paymentFormService: PaymentFormService,
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
        this.form.patchValue({
          singlePayer: [userId],
        });
      }
    });

    this.members$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((members) => {
        this.paymentFormService.onSetupMultiplePayers(members);
      });
  }

  public onMultiplePayersErrorMessage() {
    const multiplePayers = this.form.controls.multiplePayers;

    if (multiplePayers.getError('notEqual')) {
      this.multiplePayersErrorSignal.set(
        'The total amount paid must be equal to the amount of the expense',
      );
    } else {
      this.multiplePayersErrorSignal.set('');
    }
  }
}
