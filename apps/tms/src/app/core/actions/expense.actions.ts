import { Update as fromExpensesActions } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { QueryParamsModel } from '@tms/crud';
import { ExpenseModel } from '@tms/models';

export enum ExpensesActionTypes {
  CreateExpenses = '[Expenses Component] Create Expenses ',
  CreateExpensesError = '[Expenses Component] Create Expenses Error',
  CreateExpensesSuccess = '[Expenses Component] Create Expenses Success',
  UpdateExpenses = '[Expenses Component] Update Expenses ',
  UpdateExpensesSuccess = '[Expenses Component] Update Expenses Success',
  DeleteOneExpenses = '[Expenses Component] Delete One Expenses ',
  DeleteManyExpenses = '[Expenses Component] Delete Many Selected Expenses ',
  RequestExpensesPage = '[Expenses Component] Request Expenses Page ',
  LoadExpensesPage = '[Expenses API] Load Expenses Page ',
  CancellExpensesPage = '[Expenses API] Cancell Expenses Page ',
  ExpensesPageToggleLoading = '[Expenses] Expenses Page Toggle Loading',
  ExpensesActionToggleLoading = '[Expenses] Expenses Action Toggle Loading',
}

export class CreateExpenses implements Action {
  readonly type = ExpensesActionTypes.CreateExpenses;
  constructor(public payload: { expenses: ExpenseModel }) {}
}
export class CreateExpensesError implements Action {
  readonly type = ExpensesActionTypes.CreateExpensesError;
  constructor(public payload: { isError: any }) {}
}

export class CreateExpensesSuccess implements Action {
  readonly type = ExpensesActionTypes.CreateExpensesSuccess;
  constructor(public payload: { expenses: ExpenseModel }) {}
}

export class UpdateExpenses implements Action {
  readonly type = ExpensesActionTypes.UpdateExpenses;
  constructor(
    public payload: {
      partialExpenses: fromExpensesActions<ExpenseModel>; // For State update
      expenses: ExpenseModel; // For Server update (through service)
    }
  ) {}
}

export class UpdateExpensesSuccess implements Action {
  readonly type = ExpensesActionTypes.UpdateExpensesSuccess;
  constructor(
    public payload: {
      partialExpenses: fromExpensesActions<ExpenseModel>; // For State update
      expenses: ExpenseModel; // For Server update (through service)
    }
  ) {}
}

export class DeleteOneExpenses implements Action {
  readonly type = ExpensesActionTypes.DeleteOneExpenses;
  constructor(public payload: { id: string }) {}
}

export class DeleteManyExpenses implements Action {
  readonly type = ExpensesActionTypes.DeleteManyExpenses;
  constructor(public payload: { ids: string[] }) {}
}

export class RequestExpensesPage implements Action {
  readonly type = ExpensesActionTypes.RequestExpensesPage;
  constructor(
    public payload: {
      page: QueryParamsModel;
    }
  ) {}
}

export class LoadExpensesPage implements Action {
  readonly type = ExpensesActionTypes.LoadExpensesPage;
  constructor(
    public payload: {
      expenses: ExpenseModel[];
      totalCount: number;
      page: QueryParamsModel;
    }
  ) {}
}

export class CancellExpensesPage implements Action {
  readonly type = ExpensesActionTypes.CancellExpensesPage;
}

export class ExpensesPageToggleLoading implements Action {
  readonly type = ExpensesActionTypes.ExpensesPageToggleLoading;
  constructor(
    public payload: {
      isLoading: boolean;
    }
  ) {}
}

export class ExpensesActionToggleLoading implements Action {
  readonly type = ExpensesActionTypes.ExpensesActionToggleLoading;
  constructor(
    public payload: {
      isLoading: boolean;
    }
  ) {}
}

export type ExpensesActions = CreateExpenses | UpdateExpenses | UpdateExpensesSuccess | DeleteOneExpenses | DeleteManyExpenses | RequestExpensesPage | LoadExpensesPage | CancellExpensesPage | ExpensesPageToggleLoading | ExpensesActionToggleLoading | CreateExpensesError | CreateExpensesSuccess;
