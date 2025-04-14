import { User } from '@app/core/models/interfaces';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export interface State extends EntityState<User> {
  currentUserId: string | null;
}

export const initialState: State = adapter.getInitialState({
  currentUserId: null,
});

export const authReducer = createReducer(
  initialState,
  /**
   * Login actions
   */
  on(AuthActions.login, (state): State => ({ ...state })),
  on(AuthActions.loginSuccess, (state): State => ({ ...state })),
  on(AuthActions.loginFailure, (state): State => ({ ...state })),
  /**
   * Logout actions
   */
  on(AuthActions.logout, (state): State => ({ ...state })),
  on(AuthActions.logoutSuccess, (state): State => ({ ...state })),
  on(AuthActions.logoutFailure, (state): State => ({ ...state })),
  /**
   * Get user profile actions
   */
  on(AuthActions.getUserProfile, (state): State => ({ ...state })),
  on(AuthActions.getUserProfileSuccess, (state, { user }): State => {
    return adapter.addOne(user, { ...state, currentUserId: user.id });
  }),
  on(AuthActions.getUserProfileFailure, (state): State => ({ ...state })),

  /**
   * Load users by IDs actions
   */
  on(AuthActions.loadUsersByIds, (state): State => ({ ...state })),
  on(AuthActions.loadUsersByIdsSuccess, (state, { users }): State => {
    return adapter.upsertMany(users, state);
  }),
  on(AuthActions.loadUsersByIdsFailure, (state): State => ({ ...state })),
);
