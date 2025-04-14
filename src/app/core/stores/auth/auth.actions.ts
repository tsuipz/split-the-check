import { HttpErrorResponse } from '@angular/common/http';
import { User } from '@app/core/models/interfaces';
import { createAction, props } from '@ngrx/store';

/**
 * Login actions
 */
export const login = createAction('[Auth] Login');

export const loginSuccess = createAction('[Auth] Login Success');

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Logout actions
 */
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Get user profile actions
 */
export const getUserProfile = createAction('[Auth] Get User Profile');

export const getUserProfileSuccess = createAction(
  '[Auth] Get User Success',
  props<{ user: User }>(),
);

export const getUserProfileFailure = createAction(
  '[Auth] Get User Failure',
  props<{ error: HttpErrorResponse }>(),
);

/**
 * Load multiple users by their IDs actions
 */
export const loadUsersByIds = createAction(
  '[Auth] Load Users By Ids',
  props<{ userIds: string[] }>(),
);

export const loadUsersByIdsSuccess = createAction(
  '[Auth] Load Users By Ids Success',
  props<{ users: User[] }>(),
);

export const loadUsersByIdsFailure = createAction(
  '[Auth] Load Users By Ids Failure',
  props<{ error: HttpErrorResponse }>(),
);
