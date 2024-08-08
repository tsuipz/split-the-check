import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducers';

export const selectUserState = createFeatureSelector<State>('users');

export const selectCurrentUserId = createSelector(
  selectUserState,
  (state) => state.currentUserId,
);
