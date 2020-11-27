// Angular
import { Injectable } from '@angular/core';
// NGRX
import { Actions } from '@ngrx/effects';
// Services
import { AuthenticationService } from '../_services';
@Injectable()
export class PermissionEffects {
  // @Effect()
  // loadAllPermissions$ = this.actions$
  // 	.pipe(
  // 		ofType < AllPermissionsRequested > (PermissionActionTypes.AllPermissionsRequested),
  // 		mergeMap(() => this.auth.getAllPermissions()),
  // 		map((result: Permission[]) => {
  // 			return new AllPermissionsLoaded({
  // 				permissions: result
  // 			});
  // 		})
  // 	);

  // @Effect()
  // init$: Observable < Action > = defer(() => {
  // 	return of(new AllPermissionsRequested());
  // });

  constructor(private actions$: Actions, private auth: AuthenticationService) { }
}
