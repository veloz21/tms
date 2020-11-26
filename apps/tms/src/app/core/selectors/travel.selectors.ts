import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { TravelModel } from '@tms/models';
import { TravelsState } from '@tms/reducers';
import { each } from 'lodash';

export const selectTravelState = createFeatureSelector<TravelsState>('travels');

export const selectTravelById = (travelId: string) =>
  createSelector(
    selectTravelState,
    (travelsState) => travelsState.entities[travelId]
  );

export const selectTravelsPageLoading = createSelector(
  selectTravelState,
  (travelsState) => travelsState.listLoading
);

export const selectTravelsActionLoading = createSelector(
  selectTravelState,
  (travelsState) => travelsState.actionsloading
);

export const selectTravelsPageLastQuery = createSelector(
  selectTravelState,
  (travelsState) => travelsState.lastQuery
);

export const selectLastCreatedTravelId = createSelector(
  selectTravelState,
  (travelsState) => travelsState.lastCreatedTravelId
);

export const selectTravelsInitWaitingMessage = createSelector(
  selectTravelState,
  (travelsState) => travelsState.showInitWaitingMessage
);

export const selectTravelsInStore = createSelector(
  selectTravelState,
  (travelsState) => {
    const items: TravelModel[] = [];
    each(travelsState.entities, (element) => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: TravelModel[] = httpExtension.sortArray(
      items,
      travelsState.lastQuery.sortField,
      travelsState.lastQuery.sortOrder
    );
    return new QueryResultsModel(result, travelsState.totalCount, '');
  }
);

export const selectHasTravelsInStore = createSelector(
  selectTravelsInStore,
  (queryResult) => {
    if (!queryResult.totalCount) {
      return false;
    }
    return true;
  }
);
