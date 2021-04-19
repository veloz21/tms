import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromExpensesActions from '@tms/actions/expense.actions';
import { AppState } from '@tms/reducers';
import { ExpensesService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class ExpenseEffects {
  showPageLoadingDistpatcher = new fromExpensesActions.ExpensesPageToggleLoading({
    isLoading: true,
  });
  showLoadingDistpatcher = new fromExpensesActions.ExpensesPageToggleLoading({
    isLoading: true,
  });
  hideActionLoadingDistpatcher = new fromExpensesActions.ExpensesPageToggleLoading({
    isLoading: false,
  });

  @Effect()
  loadExpensesPage$ = this.actions$.pipe(
    ofType<fromExpensesActions.RequestExpensesPage>(fromExpensesActions.ExpensesActionTypes.RequestExpensesPage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const queryResponse = this.expensesService.findExpenses(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin({ queryResponse, lastQuery }).pipe(
        catchError((error) => {
          return of({
            queryResponse: {
              items: [],
              totalCount: 0,
            },
            lastQuery: payload.page,
          });
        })
      );
    }),
    map(({ queryResponse, lastQuery }) => {
      return new fromExpensesActions.LoadExpensesPage({
        expenses: queryResponse.items,
        totalCount: queryResponse.totalCount,
        page: lastQuery,
      });
    })
  );

  @Effect()
  deleteExpenses$ = this.actions$.pipe(
    ofType<fromExpensesActions.DeleteOneExpenses>(fromExpensesActions.ExpensesActionTypes.DeleteOneExpenses),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.expensesService.deleteExpenses(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteManyExpenses$ = this.actions$.pipe(
    ofType<fromExpensesActions.DeleteManyExpenses>(fromExpensesActions.ExpensesActionTypes.DeleteManyExpenses),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.expensesService.deleteManyExpenses(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateExpenses$ = this.actions$.pipe(
    ofType<fromExpensesActions.UpdateExpenses>(fromExpensesActions.ExpensesActionTypes.UpdateExpenses),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.expensesService.updateExpenses(payload.expenses).pipe(
        map(() => new fromExpensesActions.UpdateExpensesSuccess(payload)),
        catchError((isError) => of(new fromExpensesActions.CreateExpensesError({ isError })))
      );
    })
  );

  @Effect()
  createExpenses$ = this.actions$.pipe(
    ofType<fromExpensesActions.CreateExpenses>(fromExpensesActions.ExpensesActionTypes.CreateExpenses),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.expensesService.createExpenses(payload.expenses).pipe(
        map((expenses) => new fromExpensesActions.CreateExpensesSuccess({ expenses })),
        catchError((isError) => of(new fromExpensesActions.CreateExpensesError({ isError })))
      );
    })
  );

  @Effect()
  createExpensesError$ = this.actions$.pipe(
    ofType<fromExpensesActions.CreateExpensesError>(fromExpensesActions.ExpensesActionTypes.CreateExpensesError),
    map(() => {
      this.snackBar.open('Error to create Expenses', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  @Effect()
  createExpensesSucces$ = this.actions$.pipe(
    ofType<fromExpensesActions.CreateExpensesSuccess>(fromExpensesActions.ExpensesActionTypes.CreateExpensesSuccess),
    map(() => {
      this.snackBar.open('Success', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  @Effect()
  updateExpensesSuccess$ = this.actions$.pipe(
    ofType<fromExpensesActions.UpdateExpensesSuccess>(fromExpensesActions.ExpensesActionTypes.UpdateExpensesSuccess),
    map(() => {
      this.snackBar.open('Success', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private expensesService: ExpensesService,
  ) { }
}
