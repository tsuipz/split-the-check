import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducers';

const FEATURE_KEY = 'auth';

export const selectAuthState = createFeatureSelector<State>(FEATURE_KEY);

export const selectCurrentUserId = createSelector(
  selectAuthState,
  (state) => state.currentUserId,
);
