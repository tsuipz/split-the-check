import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as GroupsActions from './groups.actions';
import { Group } from '@app/core/models/interfaces';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { selectCurrentUserId } from '../auth/auth.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupsService } from '@app/core/services/groups.service';

@Injectable()
export class GroupsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private groupsService: GroupsService,
  ) {}

  loadGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.loadGroups),
      mergeMap(() => {
        return this.groupsService.getGroups().pipe(
          map((groups) =>
            GroupsActions.loadGroupsSuccess({ groups: groups as Group[] }),
          ),
          catchError((error) => {
            return of(GroupsActions.loadGroupsFailure({ error }));
          }),
        );
      }),
    );
  });

  /**
   * Create group effect
   */
  public createGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.createGroup),
      concatLatestFrom(() => this.store.select(selectCurrentUserId)),
      mergeMap(([, adminOwnerId]) => {
        if (!adminOwnerId) {
          return of(
            GroupsActions.createGroupFailure({
              error: new HttpErrorResponse({
                error: 'No admin owner ID found',
                status: 400,
                statusText: 'Bad Request',
              }),
            }),
          );
        }

        return this.groupsService.createGroup(adminOwnerId).pipe(
          map((newGroup) =>
            GroupsActions.createGroupSuccess({ group: newGroup as Group }),
          ),
          catchError((error) => {
            return of(GroupsActions.createGroupFailure({ error }));
          }),
        );
      }),
    );
  });

  loadGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.loadGroup),
      mergeMap(({ groupId }) => {
        return this.groupsService.getGroupById(groupId).pipe(
          map((group) =>
            GroupsActions.loadGroupSuccess({ group: group as Group }),
          ),
          catchError((error) => {
            return of(GroupsActions.loadGroupFailure({ error }));
          }),
        );
      }),
    );
  });
}
