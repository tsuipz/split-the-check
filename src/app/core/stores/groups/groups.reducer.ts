import { Group } from '@app/core/models/interfaces';
import { createReducer, on } from '@ngrx/store';
import * as GroupsActions from './groups.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface GroupsState extends EntityState<Group> {
  isLoading: boolean;
  error: HttpErrorResponse | null;
}

export const groupsAdapter = createEntityAdapter<Group>({
  selectId: (group: Group) => group.id,
  sortComparer: (a: Group, b: Group) => a.name.localeCompare(b.name),
});

export const initialState: GroupsState = groupsAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const groupsReducer = createReducer(
  initialState,

  // Load Groups
  on(
    GroupsActions.loadGroups,
    (state): GroupsState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),
  on(
    GroupsActions.loadGroupsSuccess,
    (state, { groups }): GroupsState =>
      groupsAdapter.setAll(groups, {
        ...state,
        isLoading: false,
      }),
  ),
  on(
    GroupsActions.loadGroupsFailure,
    (state, { error }): GroupsState => ({
      ...state,
      error,
      isLoading: false,
    }),
  ),

  // Create Group
  on(
    GroupsActions.createGroup,
    (state): GroupsState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    GroupsActions.createGroupSuccess,
    (state, { group }): GroupsState =>
      groupsAdapter.addOne(group, {
        ...state,
        isLoading: false,
      }),
  ),

  on(
    GroupsActions.createGroupFailure,
    (state, { error }): GroupsState => ({
      ...state,
      error,
      isLoading: false,
    }),
  ),

  // Load Single Group
  on(
    GroupsActions.loadGroup,
    (state): GroupsState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    GroupsActions.loadGroupSuccess,
    (state, { group }): GroupsState =>
      groupsAdapter.upsertOne(group, {
        ...state,
        isLoading: false,
      }),
  ),

  on(
    GroupsActions.loadGroupFailure,
    (state, { error }): GroupsState => ({
      ...state,
      error,
      isLoading: false,
    }),
  ),

  // Add Members to Group
  on(
    GroupsActions.addMembersToGroup,
    (state): GroupsState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    GroupsActions.addMembersToGroupSuccess,
    (state, { group }): GroupsState =>
      groupsAdapter.upsertOne(group, {
        ...state,
        isLoading: false,
      }),
  ),

  on(
    GroupsActions.addMembersToGroupFailure,
    (state, { error }): GroupsState => ({
      ...state,
      error,
      isLoading: false,
    }),
  ),
);
