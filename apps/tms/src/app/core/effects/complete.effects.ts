import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromCompleteTravelActions from '@tms/actions/completeTravel.actions';
import { AppState } from '@tms/reducers';
import { CompleteTravelService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Injectable()
export class CompleteTravelEffects {
  showPageLoadingDistpatcher = new fromCompleteTravelActions.CompleteTravelPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromCompleteTravelActions.CompleteTravelPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromCompleteTravelActions.CompleteTravelPageToggleLoading({ isLoading: false });

  @Effect()
  loadTravelsPage$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.RequestCompleteTravelPage>(fromCompleteTravelActions.CompleteTravelActionTypes.RequestCompleteTravelsPage),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showPageLoadingDistpatcher);
      const queryResponse = this.travelsService.findCompleteTravel(payload.page);
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
      return new fromCompleteTravelActions.LoadCompleteTravelPage({
        completeTravel: queryResponse.items,
        totalCount: queryResponse.totalCount,
        page: lastQuery,
      });
    })
  );

  @Effect()
  deleteTravel$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.DeleteOneCompleteTravel>(fromCompleteTravelActions.CompleteTravelActionTypes.DeleteOneCompleteTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteCompleteTravel(payload.id);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  deleteTravels$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.DeleteManyCompleteTravels>(fromCompleteTravelActions.CompleteTravelActionTypes.DeleteManyCompleteTravels),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.deleteCompleteTravels(payload.ids);
    }),
    map(() => {
      return this.hideActionLoadingDistpatcher;
    })
  );

  @Effect()
  updateTravel$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.UpdateCompleteTravel>(fromCompleteTravelActions.CompleteTravelActionTypes.UpdateCompleteTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.updateCompleteTravel(payload.completeTravel).pipe(
        map(() => new fromCompleteTravelActions.UpdateCompleteTravelSuccess(payload)),
        catchError((isError) => of(new fromCompleteTravelActions.CreateCompleteTravelError({ isError })))
      );
    })
  );

  @Effect()
  createTravel$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.CreateCompleteTravel>(fromCompleteTravelActions.CompleteTravelActionTypes.CreateCompleteTravel),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.travelsService.createCompleteTravel(payload.completeTravel).pipe(
        map((completeTravel) => new fromCompleteTravelActions.CreateCompleteTravelSuccess({ completeTravel })),
        catchError((isError) => of(new fromCompleteTravelActions.CreateCompleteTravelError({ isError })))
      );
    })
  );

  @Effect()
  createTravelError$ = this.actions$.pipe(
    ofType<fromCompleteTravelActions.CreateCompleteTravelError>(fromCompleteTravelActions.CompleteTravelActionTypes.CreateCompleteTravelError),
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
    ofType<fromCompleteTravelActions.CreateCompleteTravelSuccess>(fromCompleteTravelActions.CompleteTravelActionTypes.CreateCompleteTravelSuccess),
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
    ofType<fromCompleteTravelActions.UpdateCompleteTravelSuccess>(fromCompleteTravelActions.CompleteTravelActionTypes.UpdateCompleteTravelSuccess),
    map(() => {
      this.snackBar.open('Success Update', 'Ok', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }),
    map(() => this.hideActionLoadingDistpatcher)
  );

  constructor(private actions$: Actions, private travelsService: CompleteTravelService, private store: Store<AppState>, private snackBar: MatSnackBar) {}
}
