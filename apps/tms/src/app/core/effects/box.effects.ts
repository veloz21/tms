import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromBoxActions from '@tms/actions/box.actions';
import { AppState } from '@tms/reducers';
import { BoxesService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { BoxesViewService } from '../../views/pages/workshop/boxes/boxes-view/boxes-view.service';
import { selectBoxById } from '../selectors/boxes.selectors';

@Injectable()
export class BoxEffects {
  showPageLoadingDistpatcher = new fromBoxActions.BoxesPageToggleLoading({
    isLoading: true
  });
  showLoadingDistpatcher = new fromBoxActions.BoxesPageToggleLoading({
    isLoading: true
  });
  hideActionLoadingDistpatcher = new fromBoxActions.BoxesPageToggleLoading({
    isLoading: false
  });

  @Effect()
  loadBoxesPage$ = this.actions$
    .pipe(
      ofType<fromBoxActions.RequestBoxesPage>(fromBoxActions.BoxActionTypes.RequestBoxesPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const queryResponse = this.boxesService.findBoxes(payload.page);
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
        return new fromBoxActions.LoadBoxesPage({
          boxes: queryResponse.items,
          totalCount: queryResponse.totalCount,
          page: lastQuery,
        });
      })
    );

  @Effect()
  getBox = this.actions$
    .pipe(
      ofType<fromBoxActions.GetBox>(fromBoxActions.BoxActionTypes.GetBox),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectBoxById(payload.id))
          )
        )
      ),
      filter(([{ payload }, box]) => !box),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.boxesService.getBoxById(id)),
      map((box) => new fromBoxActions.StoreBox({ box }))
    );

  @Effect()
  deleteBox$ = this.actions$
    .pipe(
      ofType<fromBoxActions.DeleteOneBox>(fromBoxActions.BoxActionTypes.DeleteOneBox),
      mergeMap(({
        payload
      }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.boxesService.deleteBox(payload.id);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteBoxes$ = this.actions$
    .pipe(
      ofType<fromBoxActions.DeleteManyBoxes>(fromBoxActions.BoxActionTypes.DeleteManyBoxes),
      mergeMap(({
        payload
      }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.boxesService.deleteBoxes(payload.ids);
      }),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateBox$ = this.actions$
    .pipe(
      ofType<fromBoxActions.UpdateBox>(fromBoxActions.BoxActionTypes.UpdateBox),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.boxesService.updateBox(payload.box).pipe(
          map(() => (new fromBoxActions.UpdateBoxSuccess(payload))),
          catchError(isError => of(new fromBoxActions.CreateBoxError({ isError })))
        );
      }),

    );

  @Effect()
  createBox$ = this.actions$.pipe(
    ofType<fromBoxActions.CreateBox>(fromBoxActions.BoxActionTypes.CreateBox),
    mergeMap(({ payload }) => {
      this.store.dispatch(this.showLoadingDistpatcher);
      return this.boxesService.createBox(payload.box).pipe(
        map(box => (new fromBoxActions.CreateBoxSuccess({ box }))),
        catchError(isError => of(new fromBoxActions.CreateBoxError({ isError })))
      );
    }),
  );

  @Effect()
  createBoxError$ = this.actions$
    .pipe(
      ofType<fromBoxActions.CreateBoxError>(fromBoxActions.BoxActionTypes.CreateBoxError),
      map(() => {
        this.snackBar.open('Error to create Box', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );

  @Effect()
  createBoxSucces$ = this.actions$
    .pipe(
      ofType<fromBoxActions.CreateBoxSuccess>(fromBoxActions.BoxActionTypes.CreateBoxSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );

  @Effect()
  updateBoxSuccess$ = this.actions$
    .pipe(
      ofType<fromBoxActions.UpdateBoxSuccess>(fromBoxActions.BoxActionTypes.UpdateBoxSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect({ dispatch: false })
  viewBox$ = this.actions$
    .pipe(
      ofType<fromBoxActions.ViewBox>(fromBoxActions.BoxActionTypes.ViewBox),
      map(({ payload }) => {
        return this.boxesViewService.openBoxView(payload.id);
      }),
    );

  constructor(
    private snackBar: MatSnackBar,
    private actions$: Actions,
    private boxesService: BoxesService,
    private boxesViewService: BoxesViewService,
    private store: Store<AppState>
  ) { }
}
