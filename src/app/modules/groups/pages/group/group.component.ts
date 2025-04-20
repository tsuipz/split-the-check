import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { take, switchMap, filter, Observable, of } from 'rxjs';
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
}
