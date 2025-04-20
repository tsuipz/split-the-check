import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { GroupWithMembers } from '@app/core/stores/groups/groups.selectors';
import { AuthActions } from '@app/core/stores/auth';
import { Observable } from 'rxjs';
import { GroupsActions, GroupsSelectors } from '@app/core/stores/groups';
import { selectGroupWithMembersFromState } from '@app/core/stores/groups/groups.selectors';
import { selectGroupId } from '@app/core/stores/router/router.selectors';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-pay-back',
  imports: [],
  templateUrl: './pay-back.component.html',
  styleUrl: './pay-back.component.scss',
})
export class PayBackComponent implements OnInit {
  private groupId$ = this.store.select(selectGroupId);
  public group$ = this.groupId$.pipe(
    filter((groupId): groupId is string => groupId !== undefined),
    switchMap((groupId) =>
      this.store.select(GroupsSelectors.selectGroupById(groupId)),
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
