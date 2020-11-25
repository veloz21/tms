import { QueryParamsModel } from '@crud';
import { Employee } from '@interfaces';
import { EmployeeModel } from '@models';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';

export enum EmployeeActionTypes {
  CreateEmployee = '[Edit Employee Component] Create employee',
  CreateEmployeeSuccess = '[Edit Employee Component] Create employee success',
  CreateEmployeeError = '[Edit Employee Component] Create employee error',
  UpdateEmployee = '[Edit Employee Component] Update Employee',
  EmployeesStatusUpdated = '[Employeees List Page] Employees Status Updated',
  UpdateEmployeeSuccess = '[Edit Employee Component] Update Employee Success',
  DeleteOneEmployee = '[Employees List Page] One Employee Deleted',
  DeleteManyEmployees = '[Employees List Page] Many Selected Employee Deleted',
  RequestEmployeePage = '[Employees List Page] Employee Page Requested',
  LoadEmployeePage = '[Employees API] Employees Page Loaded',
  CancelEmpolyeePage = '[Employees API] Employees Page Cancelled',
  EmployeesPageToggleLoading = '[Employees] Employees Page Toggle Loading',
  EmployeesActionToggleLoading = '[Employees] Employees Action Toggle Loading',
}

export class CreateEmployee implements Action {
  readonly type = EmployeeActionTypes.CreateEmployee;
  constructor(public payload: { employee: Employee }) { }
}

export class CreateEmployeeSuccess implements Action {
  readonly type = EmployeeActionTypes.CreateEmployeeSuccess;
  constructor(public payload: { employee: Employee }) { }
}

export class CreateEmployeeError implements Action {
  readonly type = EmployeeActionTypes.CreateEmployeeError;
  constructor(public payload: { error: any }) { }
}

export class UpdateEmployee implements Action {
  readonly type = EmployeeActionTypes.UpdateEmployee;
  constructor(
    public payload: {
      partialEmployee: Update<EmployeeModel>; // For State update
      employee: EmployeeModel; // For Server update (through service)
    }
  ) { }
}

export class UpdateEmployeeSuccess implements Action {
  readonly type = EmployeeActionTypes.UpdateEmployeeSuccess;
  constructor(
    public payload: {
      partialEmployee: Update<Employee>; // For State update
      employee: Employee; // For Server update (through service)
    }
  ) { }
}

export class EmployeesStatusUpdated implements Action {
  readonly type = EmployeeActionTypes.EmployeesStatusUpdated;
  constructor(public payload: {
      employees: Employee[],
      status: number
  }) { }
}

export class DeleteOneEmployee implements Action {
  readonly type = EmployeeActionTypes.DeleteOneEmployee;
  constructor(public payload: { id: number }) { }
}

export class DeleteManyEmployees implements Action {
  readonly type = EmployeeActionTypes.DeleteManyEmployees;
  constructor(public payload: { ids: number[] }) { }
}

export class RequestEmployeePage implements Action {
  readonly type = EmployeeActionTypes.RequestEmployeePage;
  constructor(public payload: { page: QueryParamsModel }) { }
}

export class LoadEmployeePage implements Action {
  readonly type = EmployeeActionTypes.LoadEmployeePage;
  constructor(
    public payload: {
      employee: Employee[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) { }
}

export class CancelEmpolyeePage implements Action {
  readonly type = EmployeeActionTypes.CancelEmpolyeePage;
}

export class EmployeesPageToggleLoading implements Action {
  readonly type = EmployeeActionTypes.EmployeesPageToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export class EmployeesActionToggleLoading implements Action {
  readonly type = EmployeeActionTypes.EmployeesActionToggleLoading;
  constructor(public payload: { isLoading: boolean }) { }
}

export type EmployeeActions =
  | CreateEmployee
  | CreateEmployeeSuccess
  | CreateEmployeeError
  | UpdateEmployee
  | EmployeesStatusUpdated
  | UpdateEmployeeSuccess
  | DeleteOneEmployee
  | DeleteManyEmployees
  | RequestEmployeePage
  | LoadEmployeePage
  | CancelEmpolyeePage
  | EmployeesPageToggleLoading
  | EmployeesActionToggleLoading
  ;
