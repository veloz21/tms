import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { CompletedTravelModel } from '@tms/models';
import { CompletedTravelsState } from '@tms/reducers';
import { each } from 'lodash';

export const selectCompletedTravelsState = createFeatureSelector<CompletedTravelsState>('completedTravels');

export const selectCompletedTravelById = (completedTravelId: string) => createSelector(selectCompletedTravelsState, (completedTravelsState) => completedTravelsState.entities[completedTravelId]);

export const selectCompletedTravelsPageLoading = createSelector(selectCompletedTravelsState, (completedTravelsState) => completedTravelsState.listLoading);

export const selectCompletedTravelsActionLoading = createSelector(selectCompletedTravelsState, (customersState) => customersState.actionsloading);

export const selectCompletedTravelsPageLastQuery = createSelector(selectCompletedTravelsState, (completedTravelsState) => completedTravelsState.lastQuery);

export const selectLastCreatedCompletedTravelId = createSelector(selectCompletedTravelsState, (completedTravelsState) => completedTravelsState.lastCreatedCompletedTravelId);

export const selectCompletedTravelsInitWaitingMessage = createSelector(selectCompletedTravelsState, (completedTravelsState) => completedTravelsState.showInitWaitingMessage);

export const selectCompletedTravelsInStore = createSelector(selectCompletedTravelsState, (completedTravelsState) => {
  const items: CompletedTravelModel[] = [];
  each(completedTravelsState.entities, (element) => {
    items.push(element);
  });
  const httpExtension = new HttpExtenstionsModel();
  const result: CompletedTravelModel[] = httpExtension.sortArray(items, completedTravelsState.lastQuery.sortField, completedTravelsState.lastQuery.sortOrder);
  return new QueryResultsModel(result, completedTravelsState.totalCount, '');
});

export const selectHasCompletedTravelsInStore = createSelector(selectCompletedTravelsInStore, (queryResult) => {
  if (!queryResult.totalCount) {
    return false;
  }
  return true;
});
