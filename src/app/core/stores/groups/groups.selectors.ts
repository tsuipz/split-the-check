import { createFeatureSelector, createSelector } from '@ngrx/store';
import { groupsAdapter, GroupsState } from './groups.reducer';

const FEATURE_KEY = 'groups';

export const selectGroupsState =
  createFeatureSelector<GroupsState>(FEATURE_KEY);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  groupsAdapter.getSelectors();

// Select all groups
export const selectAllGroups = createSelector(selectGroupsState, selectAll);

// Select loading state
export const selectGroupsLoading = createSelector(
  selectGroupsState,
  (state) => state.isLoading,
);

// Select error state
export const selectGroupsError = createSelector(
  selectGroupsState,
  (state) => state.error,
);

// Select group by ID
export const selectGroupById = (groupId: string) =>
  createSelector(selectGroupsState, (state) => state.entities[groupId]);

// Select multiple groups by IDs
export const selectGroupsByIds = (groupIds: string[]) =>
  createSelector(selectGroupsState, (state) =>
    groupIds
      .map((id) => state.entities[id])
      .filter((group) => group !== undefined),
  );
