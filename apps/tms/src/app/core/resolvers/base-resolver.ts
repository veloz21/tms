import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { AppState } from '@tms/reducers';
import { Observable, of } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';

@Injectable()
export class BaseResolver<T> implements Resolve<T> {

  protected backRoute: string = '';
  protected requestNew: boolean = false;

  constructor(
    private router: Router,
    protected store: Store<AppState>,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<T> | Promise<T> | T {
    const id = !!route.paramMap.get('id') ? String(route.paramMap.get('id')) : null;
    if (!id) {
      return this.getEmptyModel();
    }

    this.store.dispatch(this.getModelAction(id));
    return this.waitForModelDataToLoad(id);
  }

  public manualResolve(id?: string) {
    if (!id) {
      return this.getEmptyModel();
    }

    this.store.dispatch(this.getModelAction(id));
    return this.waitForModelDataToLoad(id);
  }

  protected getEmptyModel(): T {
    return null;
  }

  protected getModelAction(id: string): Action {
    return null;
  }

  protected selectModelFromStore(id: string): Observable<T> {
    return of(null);
  }

  private waitForModelDataToLoad(id: string): Observable<T> {
    return this.selectModelFromStore(id).pipe(
      filter(model => !!model),
      take(1),
      timeout(5000),
      catchError(() => {
        // this.router.navigateByUrl(this.backRoute);
        return of(null);
      })
    );
  }
}
