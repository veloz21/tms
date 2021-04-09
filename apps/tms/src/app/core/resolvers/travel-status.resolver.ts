import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { GetTravelStatus } from '@tms/actions/travel.actions';
import { TravelStatusModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTravelStatus } from '@tms/selectors/travel.selectors';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TravelStatusResolver implements Resolve<TravelStatusModel[]> {
  constructor(private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<TravelStatusModel[]> | Promise<TravelStatusModel[]> | TravelStatusModel[] {
    this.getTravelStatusData();
    return this.waitForTravelStatusDataToLoad();
  }

  getTravelStatusData() {
    this.store.select(selectTravelStatus).pipe(
      take(1),
    ).subscribe(travelStatusStored => {
      if (!travelStatusStored || travelStatusStored.length === 0) {
        this.store.dispatch(new GetTravelStatus());
      }
    });
  }

  waitForTravelStatusDataToLoad(): Observable<TravelStatusModel[]> {
    return this.store.select(selectTravelStatus).pipe(
      filter(s => !!s && s.length > 0),
      take(1)
    );
  }
}
