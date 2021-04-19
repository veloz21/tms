import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromTireActions from '@tms/actions/tire.actions';
import { AppState } from '@tms/reducers';
import { TiresService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { TiresViewService } from '../../views/pages/workshop/tires/tires-view/tires-view.service';
import { selectTireById } from '../selectors/tire.selectors';

@Injectable()
export class TireEffects {
  showPageLoadingDistpatcher = new fromTireActions.TiresPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromTireActions.TiresPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromTireActions.TiresPageToggleLoading({ isLoading: false });

  @Effect()
  loadTiresPage$ = this.actions$
    .pipe(
      ofType<fromTireActions.RequestTiresPage>(fromTireActions.TireActionTypes.RequestTiresPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const queryResponse = this.tiresService.findTires(payload.page);
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
        return new fromTireActions.LoadTiresPage({
          tires: queryResponse.items,
          totalCount: queryResponse.totalCount,
          page: lastQuery,
        });
      })
    );

  @Effect()
  getTire = this.actions$
    .pipe(
      ofType<fromTireActions.GetTire>(fromTireActions.TireActionTypes.GetTire),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectTireById(payload.id))
          )
        )
      ),
      filter(([{ payload }, tire]) => !tire),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.tiresService.getTireById(id)),
      map((tire) => new fromTireActions.StoreTire({ tire }))
    );

  @Effect()
  deleteTire$ = this.actions$
    .pipe(
      ofType<fromTireActions.DeleteOneTire>(fromTireActions.TireActionTypes.DeleteOneTire),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.tiresService.deleteTire(payload.id);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteTires$ = this.actions$
    .pipe(
      ofType<fromTireActions.DeleteManyTires>(fromTireActions.TireActionTypes.DeleteManyTires),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.tiresService.deleteTires(payload.ids);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateTire$ = this.actions$
    .pipe(
      ofType<fromTireActions.UpdateTire>(fromTireActions.TireActionTypes.UpdateTire),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.tiresService.updateTire(payload.tire).pipe(
          map(() => (new fromTireActions.UpdateTireSuccess(payload))),
          catchError(isError => of(new fromTireActions.CreateTireError({ isError })))
        );
      }),
    );

  @Effect()
  createTire$ = this.actions$
    .pipe(
      ofType<fromTireActions.CreateTire>(fromTireActions.TireActionTypes.CreateTire),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.tiresService.createTire(payload.tire).pipe(
          map(tire => (new fromTireActions.CreateTireSuccess({ tire }))),
          catchError(isError => of(new fromTireActions.CreateTireError({ isError })))
        );
      }),
    );

  @Effect()
  createTireError$ = this.actions$
    .pipe(
      ofType<fromTireActions.CreateTireError>(fromTireActions.TireActionTypes.CreateTireError),
      map(() => {
        this.snackBar.open('Error to create Tire', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );

  @Effect()
  createTireSucces$ = this.actions$
    .pipe(
      ofType<fromTireActions.CreateTireSuccess>(fromTireActions.TireActionTypes.CreateTireSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );
  @Effect()
  updateTireSuccess$ = this.actions$
    .pipe(
      ofType<fromTireActions.UpdateTireSuccess>(fromTireActions.TireActionTypes.UpdateTireSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect({ dispatch: false })
  viewTire$ = this.actions$
    .pipe(
      ofType<fromTireActions.ViewTire>(fromTireActions.TireActionTypes.ViewTire),
      map(({ payload }) => {
        return this.tiresViewService.openTireView(payload.id);
      }),
    );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private tiresService: TiresService,
    private tiresViewService: TiresViewService,
  ) { }
}
