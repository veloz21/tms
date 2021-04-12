import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromCompletedTravelActions from '@tms/actions/completed-travel.actions';
import { AppState } from '@tms/reducers';
import { CompletedTravelService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CompletedTravelEffects {
  showPageLoadingDistpatcher = new fromCompletedTravelActions.CompletedTravelPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromCompletedTravelActions.CompletedTravelPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromCompletedTravelActions.CompletedTravelPageToggleLoading({ isLoading: false });

  @Effect()
  loadTravelsPage$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.RequestCompletedTravelsPage>(fromCompletedTravelActions.CompletedTravelActionTypes.RequestCompletedTravelsPage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const queryResponse = this.travelsService.findCompletedTravel(payload.page);
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
      return new fromCompletedTravelActions.LoadCompletedTravelPage({
        completedTravels: queryResponse.items,
        totalCount: queryResponse.totalCount,
        page: lastQuery,
      });
    })
  );

  @Effect()
  deleteTravel$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.DeleteOneCompletedTravel>(fromCompletedTravelActions.CompletedTravelActionTypes.DeleteOneCompletedTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteCompletedTravel(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteTravels$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.DeleteManyCompletedTravels>(fromCompletedTravelActions.CompletedTravelActionTypes.DeleteManyCompletedTravels),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteCompletedTravels(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateTravel$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.UpdateCompletedTravel>(fromCompletedTravelActions.CompletedTravelActionTypes.UpdateCompletedTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.updateCompletedTravel(payload.completedTravel).pipe(
        map(() => new fromCompletedTravelActions.UpdateCompletedTravelSuccess(payload)),
        catchError((isError) => of(new fromCompletedTravelActions.CreateCompletedTravelError({ isError })))
      );
    })
  );

  @Effect()
  createTravel$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.CreateCompletedTravel>(fromCompletedTravelActions.CompletedTravelActionTypes.CreateCompletedTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.createCompletedTravel(payload.completedTravel).pipe(
        map((completedTravel) => new fromCompletedTravelActions.CreateCompletedTravelSuccess({ completedTravel })),
        catchError((isError) => of(new fromCompletedTravelActions.CreateCompletedTravelError({ isError })))
      );
    })
  );

  @Effect()
  createTravelError$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.CreateCompletedTravelError>(fromCompletedTravelActions.CompletedTravelActionTypes.CreateCompletedTravelError),
    map(() => {
      this.snackBar.open('Error', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  @Effect()
  createTravelSuccess$ = this.actions$.pipe(
    ofType<fromCompletedTravelActions.CreateCompletedTravelSuccess>(fromCompletedTravelActions.CompletedTravelActionTypes.CreateCompletedTravelSuccess),
    map(() => {
      this.snackBar.open('Success', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  @Effect()
  updateTravelSuccess = this.actions$.pipe(
    ofType<fromCompletedTravelActions.UpdateCompletedTravelSuccess>(fromCompletedTravelActions.CompletedTravelActionTypes.UpdateCompletedTravelSuccess),
    map(() => {
      this.snackBar.open('Success Update', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  constructor(private actions$: Actions, private travelsService: CompletedTravelService, private store: Store<AppState>, private snackBar: MatSnackBar) { }
}
