import { HttpExtenstionsModel, QueryResultsModel } from '@crud';
import { Maintenance } from '@interfaces';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MaintenancesState } from '@reducers';
import { each } from 'lodash';

export const selectMaintenanceState = createFeatureSelector<MaintenancesState>('maintenance');

export const selectMaintenanceById = (maintenanceId: number) =>
  createSelector(
    selectMaintenanceState,
    (maintenancesState) => maintenancesState.entities[maintenanceId]
  );

export const selectMaintenancesPageLoading = createSelector(
  selectMaintenanceState,
  (maintenancesState) => maintenancesState.listLoading
);

export const selectMaintenancesActionLoading = createSelector(
  selectMaintenanceState,
  (maintenancesState) => maintenancesState.actionsloading
);

export const selectMaintenancesPageLastQuery = createSelector(
  selectMaintenanceState,
  (maintenancesState) => maintenancesState.lastQuery
);

export const selectLastCreatedMaintenanceId = createSelector(
  selectMaintenanceState,
  (maintenancesState) => maintenancesState.lastCreatedMaintenanceId
);

export const selectMaintenancesInitWaitingMessage = createSelector(
  selectMaintenanceState,
  (maintenancesState) => maintenancesState.showInitWaitingMessage
);

export const selectMaintenancesInStore = createSelector(
  selectMaintenanceState,
  (maintenancesState) => {
    const items: Maintenance[] = [];
    each(maintenancesState.entities, (element) => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: Maintenance[] = httpExtension.sortArray(
      items,
      maintenancesState.lastQuery.sortField,
      maintenancesState.lastQuery.sortOrder
    );
    return new QueryResultsModel(result, maintenancesState.totalCount, '');
  }
);

export const selectHasMaintenancesInStore = createSelector(
  selectMaintenancesInStore,
  (queryResult) => {
    if (!queryResult.totalCount) {
      return false;
    }
    return true;
  }
);
