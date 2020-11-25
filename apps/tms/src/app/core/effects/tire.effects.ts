import * as fromTireActions from '@actions/tire.actions';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParamsModel } from '@crud';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { TiresService } from '@services';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

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
        const requestToServer = this.tiresService.findTires(payload.page);
        const lastQuery = of(payload.page);
        return forkJoin([requestToServer, lastQuery]);
      }),
      map(response => {
        const result = response[0];
        const lastQuery: QueryParamsModel = response[1];
        console.log(lastQuery);
        return new fromTireActions.LoadTiresPage({
          tire: result,
          totalCount: result.length,
          page: lastQuery
        });
      }),
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

  // @Effect()
  // init$: Observable<Action> = defer(() => {
  //     const queryParams = new fromTireActions.QueryParamsModel({});
  //     return of(new fromTireActions.ProductsPageRequested({ page: queryParams }));
  // });

  constructor(
    private actions$: Actions,
    private tiresService: TiresService,
    private snackBar: MatSnackBar,
    private store: Store<AppState>) { }
}
