import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromUserActions from '@tms/actions/user.actions';
import { AppState } from '@tms/reducers';
import { UsersService } from '@tms/services';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { UsersViewService } from '../../views/pages/admin/users/users-view/users-view.service';
import { selectUserById } from '../selectors/user.selectors';

@Injectable()
export class UserEffects {
  showPageLoadingDistpatcher = new fromUserActions.UsersPageToggleLoading({ isLoading: true });
  showLoadingDistpatcher = new fromUserActions.UsersPageToggleLoading({ isLoading: true });
  hideActionLoadingDistpatcher = new fromUserActions.UsersPageToggleLoading({ isLoading: false });

  @Effect()
  loadUsersPage$ = this.actions$
    .pipe(
      ofType<fromUserActions.RequestUsersPage>(fromUserActions.UserActionTypes.RequestUsersPage),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showPageLoadingDistpatcher);
        const queryResponse = this.usersService.findUsers(payload.page);
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
        return new fromUserActions.LoadUsersPage({
          users: queryResponse.items,
          totalCount: queryResponse.totalCount,
          page: lastQuery,
        });
      })
    );

  @Effect()
  getUser = this.actions$
    .pipe(
      ofType<fromUserActions.GetUser>(fromUserActions.UserActionTypes.GetUser),
      switchMap(({ payload }) =>
        of(({ payload })).pipe(
          withLatestFrom(
            this.store.select(selectUserById(payload.id))
          )
        )
      ),
      filter(([{ payload }, user]) => !user),
      map(([{ payload }]) => payload.id),
      mergeMap(id => this.usersService.getUserById(id)),
      map((user) => new fromUserActions.StoreUser({ user }))
    );

  @Effect()
  deleteUser$ = this.actions$
    .pipe(
      ofType<fromUserActions.DeleteOneUser>(fromUserActions.UserActionTypes.DeleteOneUser),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.usersService.deleteUser(payload.id);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  deleteUsers$ = this.actions$
    .pipe(
      ofType<fromUserActions.DeleteManyUsers>(fromUserActions.UserActionTypes.DeleteManyUsers),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.usersService.deleteUsers(payload.ids);
      }
      ),
      map(() => {
        return this.hideActionLoadingDistpatcher;
      }),
    );

  @Effect()
  updateUser$ = this.actions$
    .pipe(
      ofType<fromUserActions.UpdateUser>(fromUserActions.UserActionTypes.UpdateUser),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.usersService.updateUser(payload.user).pipe(
          map(() => (new fromUserActions.UpdateUserSuccess(payload))),
          catchError(isError => of(new fromUserActions.CreateUserError({ isError })))
        );
      }),
    );

  @Effect()
  createUser$ = this.actions$
    .pipe(
      ofType<fromUserActions.CreateUser>(fromUserActions.UserActionTypes.CreateUser),
      mergeMap(({ payload }) => {
        this.store.dispatch(this.showLoadingDistpatcher);
        return this.usersService.createUser(payload.user).pipe(
          map(user => (new fromUserActions.CreateUserSuccess({ user }))),
          catchError(isError => of(new fromUserActions.CreateUserError({ isError })))
        );
      }),
    );

  @Effect()
  createUserError$ = this.actions$
    .pipe(
      ofType<fromUserActions.CreateUserError>(fromUserActions.UserActionTypes.CreateUserError),
      map(() => {
        this.snackBar.open('Error to create User', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );

  @Effect()
  createUserSucces$ = this.actions$
    .pipe(
      ofType<fromUserActions.CreateUserSuccess>(fromUserActions.UserActionTypes.CreateUserSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher),
    );
  @Effect()
  updateUserSuccess$ = this.actions$
    .pipe(
      ofType<fromUserActions.UpdateUserSuccess>(fromUserActions.UserActionTypes.UpdateUserSuccess),
      map(() => {
        this.snackBar.open('Success', 'Ok', {
          duration: 2000,
          verticalPosition: 'top'
        });
      }),
      map(() => this.hideActionLoadingDistpatcher)
    );

  @Effect({ dispatch: false })
  viewUser$ = this.actions$
    .pipe(
      ofType<fromUserActions.ViewUser>(fromUserActions.UserActionTypes.ViewUser),
      map(({ payload }) => {
        return this.usersViewService.openUserView(payload.id);
      }),
    );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private store: Store<AppState>,
    private usersService: UsersService,
    private usersViewService: UsersViewService,
  ) { }
}
