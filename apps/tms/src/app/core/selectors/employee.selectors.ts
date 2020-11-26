import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HttpExtenstionsModel, QueryResultsModel } from '@tms/crud';
import { EmployeeModel } from '@tms/models';
import { EmployeesState } from '@tms/reducers';
import { each } from 'lodash';

export const selectEmployeeState = createFeatureSelector<EmployeesState>('employees');

export const selectEmployeeById = (employeeId: string) =>
  createSelector(
    selectEmployeeState,
    (employeesState) => employeesState.entities[employeeId]
  );

export const selectEmployeesPageLoading = createSelector(
  selectEmployeeState,
  (employeesState) => employeesState.listLoading
);

export const selectEmployeesActionLoading = createSelector(
  selectEmployeeState,
  (customersState) => customersState.actionsloading
);

export const selectEmployeesPageLastQuery = createSelector(
  selectEmployeeState,
  (employeesState) => employeesState.lastQuery
);

export const selectLastCreatedEmployeeId = createSelector(
  selectEmployeeState,
  (employeesState) => employeesState.lastCreatedEmployeeId
);

export const selectEmployeesInitWaitingMessage = createSelector(
  selectEmployeeState,
  (employeesState) => employeesState.showInitWaitingMessage
);

export const selectEmployeesInStore = createSelector(
  selectEmployeeState,
  (employeesState) => {
    const items: EmployeeModel[] = [];
    each(employeesState.entities, (element) => {
      items.push(element);
    });
    const httpExtension = new HttpExtenstionsModel();
    const result: EmployeeModel[] = httpExtension.sortArray(
      items,
      employeesState.lastQuery.sortField,
      employeesState.lastQuery.sortOrder
    );
    return new QueryResultsModel(result, employeesState.totalCount, '');
  }
);

export const selectHasEmployeesInStore = createSelector(
  selectEmployeesInStore,
  (queryResult) => {
    if (!queryResult.totalCount) {
      return false;
    }
    return true;
  }
);
