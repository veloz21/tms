import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { EmployeeActions, EmployeeActionTypes } from '@tms/actions/employee.actions';
import { QueryParamsModel } from '@tms/crud';
import { Employee } from '@tms/interfaces';

export interface EmployeesState extends EntityState<Employee> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedEmployeeId: number;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Employee> = createEntityAdapter<
  Employee
>();

export const initialEmployeesState: EmployeesState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedEmployeeId: undefined,
  showInitWaitingMessage: true,
});

export function employeesReducer(
  state = initialEmployeesState,
  action: EmployeeActions
): EmployeesState {
  switch (action.type) {
    case EmployeeActionTypes.EmployeesPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedEmployeeId: undefined,
      };
    case EmployeeActionTypes.EmployeesActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case EmployeeActionTypes.CreateEmployeeSuccess:
      return adapter.addOne(action.payload.employee, {
        ...state,
        lastCreatedEmployeeId: action.payload.employee.id,
      });
    case EmployeeActionTypes.EmployeesStatusUpdated: {
      const _partialEmployees: Update<Employee>[] = [];
      for (let i = 0; i < action.payload.employees.length; i++) {
        _partialEmployees.push({
          id: action.payload.employees[i].id,
          changes: { status: action.payload.status }
        });
      }
      return adapter.updateMany(_partialEmployees, state);
    }
    case EmployeeActionTypes.UpdateEmployeeSuccess:
      return adapter.updateOne(action.payload.partialEmployee, state);
    case EmployeeActionTypes.DeleteOneEmployee:
      return adapter.removeOne(action.payload.id, state);
    case EmployeeActionTypes.DeleteManyEmployees:
      return adapter.removeMany(action.payload.ids, state);
    case EmployeeActionTypes.CancelEmpolyeePage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case EmployeeActionTypes.LoadEmployeePage:
      return adapter.addMany(action.payload.employee, {
        ...initialEmployeesState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getEmployeeState = createFeatureSelector<Employee>(
  'employees'
);

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal,
} = adapter.getSelectors();
