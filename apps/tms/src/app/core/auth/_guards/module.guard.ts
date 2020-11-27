// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// NGRX
import { Store } from '@ngrx/store';
// RxJS
import { Observable, of } from 'rxjs';
// Module reducers and selectors
import { AppState } from '../../../core/reducers/';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const moduleName = route.data.moduleName as string;
    if (!moduleName) {
      return of(false);
    }

    // return this.store
    // 	.pipe(
    // 		select(currentCompanyPermissions),
    // 		map((permissions: Permission[]) => {
    // 			const _perm = find(permissions, (elem: Permission) => {
    // 				return elem.title.toLocaleLowerCase() === moduleName.toLocaleLowerCase();
    // 			});
    // 			return _perm ? true : false;
    // 		}),
    // 		tap(hasAccess => {
    // 			if (!hasAccess) {
    // 				this.router.navigateByUrl('/error/403');
    // 			}
    // 		})
    // 	);
    return of(true);
  }
}
