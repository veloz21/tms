import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromTruckActions from '@tms/actions/truck.actions';
import { AppState } from '@tms/reducers';
import { TrucksService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { TrucksViewService } from '../../views/pages/workshop/trucks/trucks-view/trucks-view.service';
import { selectTruckById } from '../selectors/trucks.selectors';

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
        const queryResponse = this.trucksService.findTrucks(payload.page);
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
        return new fromTruckActions.LoadTrucksPage({
          trucks: queryResponse.items,
          totalCount: queryResponse.totalCount,
          page: lastQuery,
        });
      })
    );

  @Effect()
  getTruck = this.actions$
    .pipe(
      ofType<fromTruckActions.GetTruck>(fromTruckActions.TruckActionTypes.GetTruck),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectTruckById(payload.id))
          )
        )
      ),
      filter(([{ payload }, truck]) => !truck),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.trucksService.getTruckById(id)),
      map((truck) => new fromTruckActions.StoreTruck({ truck }))
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

  @Effect({ dispatch: false })
  viewTruck$ = this.actions$
    .pipe(
      ofType<fromTruckActions.ViewTruck>(fromTruckActions.TruckActionTypes.ViewTruck),
      map(({ payload }) => {
        return this.trucksViewService.openTruckView(payload.id);
      }),
    );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private trucksService: TrucksService,
    private trucksViewService: TrucksViewService,
  ) { }
}
