import { Component, OnInit, DestroyRef, inject, computed } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { take, switchMap, filter, of } from 'rxjs';
import { GroupsActions } from '@app/core/stores/groups';
import { AuthActions } from '@app/core/stores/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  selectGroupById,
  selectGroupWithMembersFromState,
  GroupWithMembers,
} from '@app/core/stores/groups/groups.selectors';
import { UserSearchDialogComponent } from '@app/shared/components/user-search-dialog/user-search-dialog.component';
import { User } from '@app/core/models/interfaces';
import { Timestamp } from '@angular/fire/firestore';
import { PaymentsSelectors } from '@app/core/stores/payments';
import { PaymentsHistoryComponent } from '@app/shared/components/payments-history/payments-history.component';
import { EditGroupNameDialogComponent } from '@app/shared/components/edit-group-name-dialog/edit-group-name-dialog.component';
import { GroupBalanceSummaryComponent } from '@app/shared/components/group-balance-summary/group-balance-summary.component';
import { adapter } from '@app/core/stores/auth/auth.reducers';
import { selectAuthState } from '@app/core/stores/auth/auth.selectors';
import { createSelector } from '@ngrx/store';

const COMPONENTS = [PaymentsHistoryComponent, GroupBalanceSummaryComponent];

const selectAllUsers = createSelector(
  selectAuthState,
  adapter.getSelectors().selectAll,
);

@Component({
  selector: 'app-group',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    ...COMPONENTS,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  public groupId$ = this.store.select(selectGroupId);
  public group$ = this.groupId$.pipe(
    filter((groupId): groupId is string => groupId !== undefined),
    switchMap((groupId) => this.store.select(selectGroupById(groupId))),
  );
  public groupWithMembersSignal = toSignal(
    this.group$.pipe(
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
    ),
    { initialValue: null },
  );
  public paymentsSignal = toSignal(
    this.store.select(PaymentsSelectors.selectAllPayments),
    { initialValue: [] },
  );
  public usersSignal = toSignal(this.store.select(selectAllUsers), {
    initialValue: [],
  });

  public allGroupUsersLoaded = computed(() => {
    const group = this.groupWithMembersSignal();
    const users = this.usersSignal();
    if (!group || !group.members) return false;
    const userIds = users.map((u) => u.id);
    // group.members can be array of user objects or IDs, handle both
    return group.members.every((member) => {
      const id = typeof member === 'string' ? member : member.id;
      return userIds.includes(id);
    });
  });

  constructor(
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.groupId$.pipe(take(1)).subscribe((groupId) => {
      if (groupId) {
        this.store.dispatch(GroupsActions.loadGroup({ groupId }));
      } else {
        this.router.navigate(['/groups']);
      }
    });
  }

  public membersComputed = computed(() => {
    const group = this.groupWithMembersSignal();
    if (!group) {
      return [];
    }

    return group.members;
  });

  public openAddMemberDialog(groupId: string): void {
    const dialogRef = this.dialog.open(UserSearchDialogComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedUsers: User[] | undefined) => {
        if (selectedUsers && selectedUsers.length > 0) {
          this.store.dispatch(
            GroupsActions.addMembersToGroup({
              groupId,
              userIds: selectedUsers.map((user) => user.id),
            }),
          );
        }
      });
  }

  public onRouteToPayBack(): void {
    // go to the pay back page
    this.router.navigate(['.', 'pay-back'], {
      relativeTo: this.activatedRoute,
    });
  }

  public onRouteToPayment(): void {
    // go to the payment page
    this.router.navigate(['.', 'payment'], { relativeTo: this.activatedRoute });
  }

  public openEditGroupNameDialog(groupId: string, currentName: string): void {
    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      width: '400px',
      data: { name: currentName },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result && result.valid) {
          const newName = result.getRawValue().name;
          this.store.dispatch(
            GroupsActions.updateGroupName({ groupId, name: newName }),
          );
        }
      });
  }
}
