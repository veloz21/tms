import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromTravelActions from '@tms/actions/travel.actions';
import { AppState } from '@tms/reducers';
import { TravelsService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { selectTravelById } from '../selectors/travel.selectors';

@Injectable()
export class TravelEffects {
  showPageLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({ isLoading: true, });
  showLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromTravelActions.TravelsPageToggleLoading({ isLoading: false, });

  @Effect()
  loadTravelsPage$ = this.actions$.pipe(
    ofType<fromTravelActions.RequestTravelsPage>(fromTravelActions.TravelActionTypes.RequestTravelsPage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const queryResponse = this.travelsService.findTravels(payload.page);
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
      return new fromTravelActions.LoadTravelsPage({
        travel: queryResponse.items,
        totalCount: queryResponse.totalCount,
        page: lastQuery,
      });
    })
  );

  @Effect()
  getTravel = this.actions$
    .pipe(
      ofType<fromTravelActions.GetTravel>(fromTravelActions.TravelActionTypes.GetTravel),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectTravelById(payload.id))
          )
        )
      ),
      filter(([{ payload }, travel]) => !travel),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.travelsService.getTravelById(id)),
      map((travel) => new fromTravelActions.StoreTravel({ travel }))
    );

  @Effect()
  deleteTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.DeleteOneTravel>(fromTravelActions.TravelActionTypes.DeleteOneTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteTravel(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteTravels$ = this.actions$.pipe(
    ofType<fromTravelActions.DeleteManyTravels>(fromTravelActions.TravelActionTypes.DeleteManyTravels),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteTravels(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.UpdateTravel>(fromTravelActions.TravelActionTypes.UpdateTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.updateTravel(payload.travel).pipe(
        map(() => (new fromTravelActions.UpdateTravelSuccess(payload))),
        catchError(error => of(new fromTravelActions.CreateTravelError({ error })))
      );
    })
  );

  @Effect()
  createTravel$ = this.actions$.pipe(
    ofType<fromTravelActions.CreateTravel>(fromTravelActions.TravelActionTypes.CreateTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.createTravel(payload.travel).pipe(
        map(travel => (new fromTravelActions.CreateTravelSuccess({ travel }))),
        catchError(error => of(new fromTravelActions.CreateTravelError({ error })))
      );
    }),
  );

  @Effect()
  createTravelError$ = this.actions$
    .pipe(
      ofType<fromTravelActions.CreateTravelError>(fromTravelActions.TravelActionTypes.CreateTravelError),
      map(() => {
        this.snackBar.open('Error', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  createTravelSuccess$ = this.actions$
    .pipe(
      ofType<fromTravelActions.CreateTravelSuccess>(fromTravelActions.TravelActionTypes.CreateTravelSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  updateTravelSuccess = this.actions$
    .pipe(
      ofType<fromTravelActions.UpdateTravelSuccess>(fromTravelActions.TravelActionTypes.UpdateTravelSuccess),
      map(() => {
        this.snackBar.open('Success Update', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect()
  getTravelStatus = this.actions$
    .pipe(
      ofType<fromTravelActions.GetTravelStatus>(fromTravelActions.TravelActionTypes.GetTravelStatus),
      mergeMap(() => {
        return this.travelsService.getTravelStatus();
      }),
      map((travelStatus) => new fromTravelActions.StoreTravelStatus({ travelStatus }))
    );

  @Effect()
  updateTravelStatus$ = this.actions$.pipe(
    ofType<fromTravelActions.UpdateTravelStatus>(fromTravelActions.TravelActionTypes.UpdateTravelStatus),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.updateTravelStatus(payload.travelId, payload.status).pipe(
        map((travelUpdated) => (new fromTravelActions.UpdateTravelSuccess({
          partialTravel: {
            id: payload.travelId,
            changes: travelUpdated,
          },
          travel: travelUpdated,
        }))),
        catchError(error => of(new fromTravelActions.CreateTravelError({ error })))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private travelsService: TravelsService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) { }
}
