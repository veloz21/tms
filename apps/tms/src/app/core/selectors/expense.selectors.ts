import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { ExpensesModel } from '@tms/models';
import { ExpensesState } from '@tms/reducers';
import { each } from 'lodash';

export const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectExpensesById = (boxId: string) => createSelector(selectExpensesState, (expensesState) => expensesState.entities[boxId]);

export const selectExpensesPageLoading = createSelector(selectExpensesState, (expensesState) => expensesState.listLoading);

export const selectExpensesActionLoading = createSelector(selectExpensesState, (customersState) => customersState.actionsloading);

export const selectExpensesPageLastQuery = createSelector(selectExpensesState, (expensesState) => expensesState.lastQuery);

export const selectLastCreatedExpensesId = createSelector(selectExpensesState, (expensesState) => expensesState.lastCreatedExpensesId);

export const selectExpensesInitWaitingMessage = createSelector(selectExpensesState, (expensesState) => expensesState.showInitWaitingMessage);

export const selectExpensesInStore = createSelector(selectExpensesState, (expensesState) => {
  const items: ExpensesModel[] = [];
  each(expensesState.entities, (element) => {
    items.push(element);
  });
  const httpExtension = new HttpExtenstionsModel();
  const result: ExpensesModel[] = httpExtension.sortArray(items, expensesState.lastQuery.sortField, expensesState.lastQuery.sortOrder);
  return new QueryResultsModel(result, expensesState.totalCount, '');
});

export const selectHasBoxesInStore = createSelector(selectExpensesInStore, (queryResult) => {
  if (!queryResult.totalCount) {
    return false;
  }
  return true;
});
