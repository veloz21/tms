import * as fromEmployeeActions from '@actions/employee.actions';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { QueryParamsModel } from '@crud';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { EmployeesService } from '@services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class EmployeeEffects {
  showPageLoadingDistpatcher = new fromEmployeeActions.EmployeesPageToggleLoading({ isLoading: true, });
  showLoadingDistpatcher = new fromEmployeeActions.EmployeesPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromEmployeeActions.EmployeesPageToggleLoading({ isLoading: false, });

  @Effect()
  loadEmployeesPage$ = this.actions$.pipe(
    ofType<fromEmployeeActions.RequestEmployeePage>(fromEmployeeActions.EmployeeActionTypes.RequestEmployeePage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const requestToServer = this.employeesService.findEmployees(
        payload.page
      );
      const lastQuery = of(payload.page);
      return forkJoin([requestToServer, lastQuery]);
    }),
    map((response) => {
      const result = response[0];
      const lastQuery: QueryParamsModel = response[1];
      return new fromEmployeeActions.LoadEmployeePage({
        employee: result,
        totalCount: result.length,
        page: lastQuery,
      });
    })
  );

  @Effect()
  deleteEmployee$ = this.actions$.pipe(
    ofType<fromEmployeeActions.DeleteOneEmployee>(fromEmployeeActions.EmployeeActionTypes.DeleteOneEmployee),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.employeesService.deleteEmployee(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteEmployees$ = this.actions$.pipe(
    ofType<fromEmployeeActions.DeleteManyEmployees>(fromEmployeeActions.EmployeeActionTypes.DeleteManyEmployees),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.employeesService.deleteEmployees(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateEmployee$ = this.actions$.pipe(
    ofType<fromEmployeeActions.UpdateEmployee>(fromEmployeeActions.EmployeeActionTypes.UpdateEmployee),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.employeesService.updateEmployee(payload.employee).pipe(
        map(() => (new fromEmployeeActions.UpdateEmployeeSuccess(payload))),
        catchError(error => of(new fromEmployeeActions.CreateEmployeeError({ error })))
      );
    })
  );

  @Effect()
  createEmployee$ = this.actions$.pipe(
    ofType<fromEmployeeActions.CreateEmployee>(fromEmployeeActions.
      EmployeeActionTypes.CreateEmployee),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.employeesService.createEmployee(payload.employee).pipe(
        map(employee => (new fromEmployeeActions.CreateEmployeeSuccess({ employee }))),
        catchError(error => of(new fromEmployeeActions.CreateEmployeeError({ error })))
      );
    })
  );

  @Effect()
  createEmployeeError$ = this.actions$
    .pipe(
      ofType<fromEmployeeActions.CreateEmployeeError>(fromEmployeeActions.EmployeeActionTypes.CreateEmployeeError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createEmployeeSuccess$ = this.actions$
    .pipe(
      ofType<fromEmployeeActions.CreateEmployeeSuccess>(fromEmployeeActions.EmployeeActionTypes.CreateEmployeeSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateEmployeeSuccess = this.actions$
    .pipe(
      ofType<fromEmployeeActions.UpdateEmployeeSuccess>(fromEmployeeActions.EmployeeActionTypes.UpdateEmployeeSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  constructor(
    private actions$: Actions,
    private employeesService: EmployeesService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>
  ) { }
}
