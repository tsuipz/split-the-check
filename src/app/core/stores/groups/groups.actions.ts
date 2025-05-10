import { HttpErrorResponse } from '@angular/common/http';
import { Group } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Load groups actions
 */
export const loadGroups = createAction('[Groups] Load Groups');

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: Group[] }>(),
);

export const loadGroupsFailure = createAction(
  '[Groups] Load Groups Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Create group actions
 */
export const createGroup = createAction('[Groups] Create Group');

export const createGroupSuccess = createAction(
  '[Groups] Create Group Success',
  props<{ group: Group }>(),
);

export const createGroupFailure = createAction(
  '[Groups] Create Group Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Get single group actions
 */
export const loadGroup = createAction(
  '[Groups] Load Group',
  props<{ groupId: string }>(),
);

export const loadGroupSuccess = createAction(
  '[Groups] Load Group Success',
  props<{ group: Group }>(),
);

export const loadGroupFailure = createAction(
  '[Groups] Load Group Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Add members to group actions
 */
export const addMembersToGroup = createAction(
  '[Groups] Add Members To Group',
  props<{ groupId: string; userIds: string[] }>(),
);

export const addMembersToGroupSuccess = createAction(
  '[Groups] Add Members To Group Success',
  props<{ group: Group }>(),
);

export const addMembersToGroupFailure = createAction(
  '[Groups] Add Members To Group Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Update group name actions
 */
export const updateGroupName = createAction(
  '[Groups] Update Group Name',
  props<{ groupId: string; name: string }>(),
);

export const updateGroupNameSuccess = createAction(
  '[Groups] Update Group Name Success',
  props<{ group: Group }>(),
);

export const updateGroupNameFailure = createAction(
  '[Groups] Update Group Name Failure',
  props<{ error: HttpErrorResponse }>(),
);
