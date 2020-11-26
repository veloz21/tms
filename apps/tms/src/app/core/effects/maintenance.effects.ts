import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromMaintenanceActions from '@tms/actions/maintenance.actions';
import { QueryParamsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { MaintenancesService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class MaintenanceEffects {
  showPageLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromMaintenanceActions.MaintenancesPageToggleLoading({ isLoading: false });

  @Effect()
  loadMaintenancesPage$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.RequestMaintenancesPage>(fromMaintenanceActions.MaintenanceActionTypes.RequestMaintenancesPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const requestToServer = this.maintenancesService.findMaintenances(payload.page);
        const lastQuery = of(payload.page);
        return forkJoin([requestToServer, lastQuery]);
      }),
      map(response => {
        const result = response[0];
        const lastQuery: QueryParamsModel = response[1];
        return new fromMaintenanceActions.LoadMaintenancesPage({
          maintenance: result,
          totalCount: result.length,
          page: lastQuery
        });
      }),
    );

  @Effect()
  deleteMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.DeleteOneMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.DeleteOneMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.deleteMaintenance(payload.id);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteMaintenances$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.DeleteManyMaintenances>(fromMaintenanceActions.MaintenanceActionTypes.DeleteManyMaintenances),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.deleteMaintenances(payload.ids);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.UpdateMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.UpdateMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.updateMaintenance(payload.maintenance).pipe(
          map(() => (new fromMaintenanceActions.UpdateMaintenanceSuccess(payload))),
          catchError(error => of(new fromMaintenanceActions.CreateMaintenanceError({ error })))
        );
      }),
    );

  @Effect()
  createMaintenance$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenance>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenance),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.maintenancesService.createMaintenance(payload.maintenance).pipe(
          map(maintenance => (new fromMaintenanceActions.CreateMaintenanceSuccess({ maintenance }))),
          catchError(error => of(new fromMaintenanceActions.CreateMaintenanceError({ error })))
        );
      })
    );

  @Effect()
  createMaintenanceError$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenanceError>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenanceError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createMaintenanceSuccess$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.CreateMaintenanceSuccess>(fromMaintenanceActions.MaintenanceActionTypes.CreateMaintenanceSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateMaintenanceSuccess$ = this.actions$
    .pipe(
      ofType<fromMaintenanceActions.UpdateMaintenanceSuccess>(fromMaintenanceActions.MaintenanceActionTypes.UpdateMaintenanceSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  constructor(private snackBar: MatSnackBar, private actions$: Actions, private maintenancesService: MaintenancesService, private store: Store<AppState>) { }
}
