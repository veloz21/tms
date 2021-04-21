import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { UserModel } from '@tms/models';
import { UsersState } from '@tms/reducers';
import { each } from 'lodash';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUserById = (userId: string) => createSelector(
  selectUsersState,
  usersState => usersState.entities[userId]
);

export const selectUsersPageLoading = createSelector(
  selectUsersState,
  usersState => usersState.listLoading
);

export const selectUsersActionLoading = createSelector(
  selectUsersState,
  customersState => customersState.actionsloading
);

export const selectUsersPageLastQuery = createSelector(
  selectUsersState,
  usersState => usersState.lastQuery
);

export const selectLastCreatedUserId = createSelector(
  selectUsersState,
  usersState => usersState.lastCreatedUserId,
);

export const selectUsersInitWaitingMessage = createSelector(
  selectUsersState,
  usersState => usersState.showInitWaitingMessage
);

export const selectUsersInStore = createSelector(
  selectUsersState,
  usersState => {
    const items: UserModel[] = [];
    each(usersState.entities, element => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: UserModel[] = httpExtension.sortArray(items, usersState.lastQuery.sortField, usersState.lastQuery.sortOrder);
    return new QueryResultsModel(result, usersState.totalCount, '');
  }
);

export const selectHasUsersInStore = createSelector(
  selectUsersInStore,
  queryResult => {
    if (!queryResult.totalCount) {
      return false;
    }
    return true;
  }
);
