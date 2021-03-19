import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { TravelModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectCompleteTravelById } from '@tms/selectors/completeTravel.selectors';
import { CompleteTravelService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class CompleteTravelResolver implements Resolve<TravelModel> {
  constructor(
    private completeTravelService: CompleteTravelService,
    private store: Store<AppState>
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<TravelModel> | Promise<TravelModel> | TravelModel {
    const id = !!route.paramMap.get('id')
      ? String(route.paramMap.get('id'))
      : null;
    if (!id) {
      return this.getInitialCompleteTravel(id);
    }
    this.getCompleteTravelData(id);
    return this.waitForCompleteTravelDataToLoad(id);
  }

  getInitialCompleteTravel(id: string) {
    return new TravelModel();
  }

  getCompleteTravelData(id: string) {
    this.store
      .select(selectCompleteTravelById(id))
      .pipe(take(1))
      .subscribe((truckStored) => {
        if (!truckStored) {
          return this.completeTravelService.getCompleteTravelById(id);
        }
      });
  }

  waitForCompleteTravelDataToLoad(id: string): Observable<TravelModel> {
    return this.store.select(selectCompleteTravelById(id)).pipe(
      filter((tire) => !!tire),
      take(1)
    );
  }
}
