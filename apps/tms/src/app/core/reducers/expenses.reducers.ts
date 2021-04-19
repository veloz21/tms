import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { ExpensesActions, ExpensesActionTypes } from '@tms/actions/expense.actions';
import { QueryParamsModel } from '@tms/crud';
import { ExpenseModel } from '@tms/models';

export interface ExpensesState extends EntityState<ExpenseModel> {
  listLoading: boolean;
  actionsloading: boolean;
  totalCount: number;
  lastQuery: QueryParamsModel;
  lastCreatedExpensesId: string;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<ExpenseModel> = createEntityAdapter<ExpenseModel>();

export const initialExpensesState: ExpensesState = adapter.getInitialState({
  listLoading: false,
  actionsloading: false,
  totalCount: 0,
  lastQuery: new QueryParamsModel({}),
  lastCreatedExpensesId: undefined,
  showInitWaitingMessage: true,
});

export function expensesReducer(state = initialExpensesState, action: ExpensesActions): ExpensesState {
  switch (action.type) {
    case ExpensesActionTypes.ExpensesPageToggleLoading:
      return {
        ...state,
        listLoading: action.payload.isLoading,
        lastCreatedExpensesId: undefined,
      };
    case ExpensesActionTypes.ExpensesActionToggleLoading:
      return {
        ...state,
        actionsloading: action.payload.isLoading,
      };
    case ExpensesActionTypes.CreateExpensesSuccess:
      return adapter.addOne(action.payload.expenses, {
        ...state,
        lastCreatedExpensesId: action.payload.expenses.id,
      });

    case ExpensesActionTypes.UpdateExpensesSuccess:
      return adapter.updateOne(action.payload.partialExpenses, state);

    case ExpensesActionTypes.DeleteOneExpenses:
      return adapter.removeOne(action.payload.id, state);
    case ExpensesActionTypes.DeleteManyExpenses:
      return adapter.removeMany(action.payload.ids, state);
    case ExpensesActionTypes.CancellExpensesPage:
      return {
        ...state,
        listLoading: false,
        lastQuery: new QueryParamsModel({}),
      };
    case ExpensesActionTypes.LoadExpensesPage:
      return adapter.addMany(action.payload.expenses, {
        ...initialExpensesState,
        totalCount: action.payload.totalCount,
        listLoading: false,
        lastQuery: action.payload.page,
        showInitWaitingMessage: false,
      });
    default:
      return state;
  }
}

export const getExpensesState = createFeatureSelector<ExpenseModel>('expenses');

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
