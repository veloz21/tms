// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
// RxJS
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
// Auth actions
import * as fromAuthActions from '../_actions/auth.actions';
import { AuthenticationService } from '../_services';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType<fromAuthActions.Login>(fromAuthActions.AuthActionTypes.Login),
    mergeMap(({ payload }) => {
      return this.authService.login(payload.user).pipe(
        switchMap((loginResponse) => {
          return of(
            new fromAuthActions.LoginSuccess({
              accessToken: loginResponse.accessToken,
              refreshToken: loginResponse.refreshToken,
            })
          );
        }),
        catchError((error) => of(new fromAuthActions.LoginError({ error })))
      );
    }),
    catchError((err) => of([console.log(err)]))
  );

  @Effect({
    dispatch: false,
  })
  logout$ = this.actions$.pipe(
    ofType<fromAuthActions.Logout>(fromAuthActions.AuthActionTypes.Logout),
    mergeMap(() => {
      return this.authService.logout().pipe(
        tap(() => {
          this.router.navigate(['/auth/login'], {});
        }),
        catchError((error) =>
          tap(() => {
            this.router.navigate(['/auth/login'], {});
          })
        )
      );
    })
  );

  @Effect({
    dispatch: false,
  })
  loginSuccess$ = this.actions$.pipe(
    ofType<fromAuthActions.LoginSuccess>(
      fromAuthActions.AuthActionTypes.LoginSuccess
    ),
    tap(() => {
      this.router.navigate(['/dashboard'], {});
    })
  );

  @Effect({
    dispatch: false,
  })
  register$ = this.actions$.pipe(
    ofType<fromAuthActions.Register>(fromAuthActions.AuthActionTypes.Register),
    tap((action) => {
      localStorage.setItem(
        environment.authTokenKey,
        action.payload.accessToken
      );
    })
  );

  @Effect()
  requestCompany$ = this.actions$.pipe(
    ofType<fromAuthActions.RequestCompany>(
      fromAuthActions.AuthActionTypes.RequestCompany
    ),
    mergeMap(() => {
      return this.authService
        .requestCompany()
        .pipe(
          tap((response) => console.log('requestCompany response', response)),
          switchMap((loginResponse) => {
            return of(
              new fromAuthActions.CompanyLoaded({ company: loginResponse })
            );
          })
        )
        .pipe(catchError((error) => of(console.log(error))));
    })
  );

  // @Effect({
  //   dispatch: false
  // })
  // loadUser$ = this.actions$
  //   .pipe(
  //     ofType<fromAuthActions.CompanyRequested>(fromAuthActions.AuthActionTypes.CompanyRequested),
  //     withLatestFrom(this.store.pipe(select(isCompanyLoaded))),
  //     filter(([action, _isCompanyLoaded]) => !_isCompanyLoaded),
  //     mergeMap(([action, _isUserLoaded]) => this.auth.getCompanyByToken()),
  //     tap(_company => {
  //       if (_company) {
  //         this.store.dispatch(new fromAuthActions.CompanyLoaded({
  //           company: _company
  //         }));
  //       } else {
  //         this.store.dispatch(new fromAuthActions.Logout());
  //       }
  //     })
  //   );

  // @Effect()
  // init$: Observable<Action> = defer(() => {
  //   const userToken = localStorage.getItem(environment.authTokenKey);
  //   let observableResult = of({
  //     type: 'NO_ACTION',
  //   });
  //   if (userToken) {
  //     observableResult = of(
  //       new fromAuthActions.Login({
  //         Success: 'Si hay token',
  //       })
  //     );
  //   }
  //   return observableResult;
  // });

  private returnUrl: string;

  constructor(
    private actions$: Actions,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.returnUrl = event.url;
      }
    });
  }
}
