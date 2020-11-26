import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromTruckActions from '@tms/actions/truck.actions';
import { QueryParamsModel } from '@tms/crud';
import { AppState } from '@tms/reducers';
import { TrucksService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class TruckEffects {
  showPageLoadingDistpatcher = new fromTruckActions.TrucksPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromTruckActions.TrucksPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromTruckActions.TrucksPageToggleLoading({ isLoading: false });

  @Effect()
  loadTrucksPage$ = this.actions$
    .pipe(
      ofType<fromTruckActions.RequestTrucksPage>(fromTruckActions.TruckActionTypes.RequestTrucksPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const requestToServer = this.trucksService.findTrucks(payload.page);
        const lastQuery = of(payload.page);
        return forkJoin([requestToServer, lastQuery]);
      }),
      map(response => {
        const result = response[0];
        const lastQuery: QueryParamsModel = response[1];
        return new fromTruckActions.LoadTrucksPage({
          truck: result,
          totalCount: result.length,
          page: lastQuery
        });
      })
    );

  @Effect()
  deleteTruck$ = this.actions$
    .pipe(
      ofType<fromTruckActions.DeleteOneTruck>(fromTruckActions.TruckActionTypes.DeleteOneTruck),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.trucksService.deleteTruck(payload.id);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  deleteTrucks$ = this.actions$
    .pipe(
      ofType<fromTruckActions.DeleteManyTrucks>(fromTruckActions.TruckActionTypes.DeleteManyTrucks),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.trucksService.deleteTrucks(payload.ids);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      })
    );

  @Effect()
  updateTruck$ = this.actions$
    .pipe(
      ofType<fromTruckActions.UpdateTruck>(fromTruckActions.TruckActionTypes.UpdateTruck),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.trucksService.updateTruck(payload.truck).pipe(
          map(() => (new fromTruckActions.UpdateTruckSuccess(payload))),
          catchError(error => of(new fromTruckActions.CreateTruckError({ error })))
        );
      })
    );

  @Effect()
  createTruck$ = this.actions$
    .pipe(
      ofType<fromTruckActions.CreateTruck>(fromTruckActions.TruckActionTypes.CreateTruck),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.trucksService.createTruck(payload.truck).pipe(
          map(truck => (new fromTruckActions.CreateTruckSuccess({ truck }))),
          catchError(error => of(new fromTruckActions.CreateTruckError({ error })))
        );
      }),
    );

  @Effect()
  createTruckError$ = this.actions$
    .pipe(
      ofType<fromTruckActions.CreateTruckError>(fromTruckActions.TruckActionTypes.CreateTruckError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createTruckSuccess$ = this.actions$
    .pipe(
      ofType<fromTruckActions.CreateTruckSuccess>(fromTruckActions.TruckActionTypes.CreateTruckSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateTruckSuccess = this.actions$
    .pipe(
      ofType<fromTruckActions.UpdateTruckSuccess>(fromTruckActions.TruckActionTypes.UpdateTruckSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  constructor(private snackBar: MatSnackBar, private actions$: Actions, private trucksService: TrucksService, private store: Store<AppState>) { }
}
