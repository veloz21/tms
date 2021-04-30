import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TravelsStatusState } from '@tms/reducers';

export const selectTravelStatusState = createFeatureSelector<TravelsStatusState>('status');

export const selectTravelStatus = createSelector(selectTravelStatusState, (travelsState) => travelsState.travelStatus);
