import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as GroupsActions from './groups.actions';
import { Group } from '@app/core/models/interfaces';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { selectCurrentUserId } from '../auth/auth.selectors';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupsService } from '@app/core/services/groups.service';
import { Router } from '@angular/router';
import * as GroupsSelectors from './groups.selectors';
import { PaymentsActions } from '../payments';

@Injectable()
export class GroupsEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private groupsService: GroupsService,
    private router: Router,
  ) {}

  loadGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.loadGroups),
      concatLatestFrom(() => this.store.select(selectCurrentUserId)),
      mergeMap(([, userId]) => {
        if (!userId) {
          return of(
            GroupsActions.loadGroupsFailure({
              error: new HttpErrorResponse({ error: 'No user ID found' }),
            }),
          );
        }

        return this.groupsService.getGroups(userId).pipe(
          map((groups) => GroupsActions.loadGroupsSuccess({ groups })),
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

  public loadGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.loadGroup),
      concatLatestFrom(() => [
        this.store.select(selectCurrentUserId),
        this.store.select(GroupsSelectors.selectAllEntities),
      ]),
      mergeMap(([{ groupId }, userId, groupEntities]) => {
        if (groupEntities && groupEntities[groupId]) {
          return of(
            GroupsActions.loadGroupSuccess({
              group: groupEntities[groupId],
            }),
          );
        }

        if (!userId) {
          return of(
            GroupsActions.loadGroupFailure({
              error: new HttpErrorResponse({ error: 'No user ID found' }),
            }),
          );
        }

        return this.groupsService.getGroupById(groupId, userId).pipe(
          map((group) => GroupsActions.loadGroupSuccess({ group })),
          catchError((error) => {
            return of(GroupsActions.loadGroupFailure({ error }));
          }),
        );
      }),
    );
  });

  public navigateAfterCreateGroupSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(GroupsActions.createGroupSuccess),
        tap(({ group }) => this.router.navigate(['/groups', group.id])),
      );
    },
    { dispatch: false },
  );

  public navigateAfterLoadGroupFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(GroupsActions.loadGroupFailure),
        // tap(() => this.router.navigate(['/groups'])),
      );
    },
    { dispatch: false },
  );

  public addMembersToGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.addMembersToGroup),
      mergeMap(({ groupId, userIds }) => {
        return this.groupsService.addMembersToGroup(groupId, userIds).pipe(
          map((group) => GroupsActions.addMembersToGroupSuccess({ group })),
          catchError((error) => {
            return of(GroupsActions.addMembersToGroupFailure({ error }));
          }),
        );
      }),
    );
  });

  /**
   * Get payments by group effect
   */
  public getPaymentsByGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupsActions.loadGroupSuccess),
      map(({ group }) =>
        PaymentsActions.getPaymentsByGroup({ groupId: group.id }),
      ),
    );
  });
}
