import { createFeatureSelector, createSelector } from '@ngrx/store';
import { groupsAdapter, GroupsState } from './groups.reducer';
import { Group, User } from '@app/core/models/interfaces';
import { selectUsersByIds } from '../auth/auth.selectors';

const FEATURE_KEY = 'groups';

export interface GroupWithMembers extends Omit<Group, 'members'> {
  members: User[];
}

export const selectGroupsState =
  createFeatureSelector<GroupsState>(FEATURE_KEY);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  groupsAdapter.getSelectors();

// Select all groups
export const selectAllGroups = createSelector(selectGroupsState, selectAll);

// Select all entities
export const selectAllEntities = createSelector(
  selectGroupsState,
  selectEntities,
);

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

export const selectGroupWithMembers = (
  group: Group,
  users: User[],
): GroupWithMembers => ({
  ...group,
  members: users,
});

export const selectGroupWithMembersFromState = (group: Group) =>
  createSelector(selectUsersByIds(group.members), (users: User[]) => ({
    ...group,
    members: users,
  }));
