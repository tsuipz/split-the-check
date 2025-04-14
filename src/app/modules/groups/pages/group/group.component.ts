import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { take, switchMap, filter } from 'rxjs';
import { GroupsActions } from '@app/core/stores/groups';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { selectGroupById } from '@app/core/stores/groups/groups.selectors';
import { UserSearchDialogComponent } from '@app/shared/components/user-search-dialog/user-search-dialog.component';
import { User } from '@app/core/models/interfaces';

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

  constructor(
    private store: Store,
    private router: Router,
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
}
