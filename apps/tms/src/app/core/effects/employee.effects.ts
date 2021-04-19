import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromEmployeeActions from '@tms/actions/employee.actions';
import { AppState } from '@tms/reducers';
import { EmployeesService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { selectEmployeeById } from '../selectors/employee.selectors';

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
      const queryResponse = this.employeesService.findEmployees(payload.page);
      const lastQuery = of(payload.page);
      return forkJoin({ queryResponse, lastQuery }).pipe(
        catchError(error => {
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
      return new fromEmployeeActions.LoadEmployeePage({
        employees: queryResponse.items,
        totalCount: queryResponse.totalCount,
        page: lastQuery,
      });
    })
  );

  @Effect()
  getEmployee = this.actions$
    .pipe(
      ofType<fromEmployeeActions.GetEmployee>(fromEmployeeActions.EmployeeActionTypes.GetEmployee),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectEmployeeById(payload.id))
          )
        )
      ),
      filter(([{ payload }, employee]) => !employee),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.employeesService.getEmployeeById(id)),
      map((employee) => new fromEmployeeActions.StoreEmployee({ employee }))
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
