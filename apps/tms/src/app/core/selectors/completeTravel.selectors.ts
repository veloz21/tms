import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { TravelModel } from '@tms/models';
import { CompleteTravelsState } from '@tms/reducers';
import { each } from 'lodash';

export const selectCompleteTravelsState = createFeatureSelector<CompleteTravelsState>('completeTravels');

export const selectCompleteTravelById = (completeTravelId: string) => createSelector(selectCompleteTravelsState, (completeTravelsState) => completeTravelsState.entities[completeTravelId]);

export const selectCompleteTravelsPageLoading = createSelector(selectCompleteTravelsState, (completeTravelsState) => completeTravelsState.listLoading);

export const selectCompleteTravelsActionLoading = createSelector(selectCompleteTravelsState, (customersState) => customersState.actionsloading);

export const selectCompleteTravelsPageLastQuery = createSelector(selectCompleteTravelsState, (completeTravelsState) => completeTravelsState.lastQuery);

export const selectLastCreatedCompleteTravelId = createSelector(selectCompleteTravelsState, (completeTravelsState) => completeTravelsState.lastCreatedCompleteTravelId);

export const selectCompleteTravelsInitWaitingMessage = createSelector(selectCompleteTravelsState, (completeTravelsState) => completeTravelsState.showInitWaitingMessage);

export const selectCompleteTravelsInStore = createSelector(selectCompleteTravelsState, (completeTravelsState) => {
  const items: TravelModel[] = [];
  each(completeTravelsState.entities, (element) => {
    items.push(element);
  });
  const httpExtension = new HttpExtenstionsModel();
  const result: TravelModel[] = httpExtension.sortArray(items, completeTravelsState.lastQuery.sortField, completeTravelsState.lastQuery.sortOrder);
  return new QueryResultsModel(result, completeTravelsState.totalCount, '');
});

export const selectHasCompleteTravelsInStore = createSelector(selectCompleteTravelsInStore, (queryResult) => {
  if (!queryResult.totalCount) {
    return false;
  }
  return true;
});
