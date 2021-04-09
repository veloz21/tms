import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { TravelModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTravelById } from '@tms/selectors/travel.selectors';
import { TravelsService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { GetTravel } from '../actions/travel.actions';

@Injectable()
export class TravelResolver implements Resolve<TravelModel> {
  constructor(private travelsService: TravelsService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<TravelModel> | Promise<TravelModel> | TravelModel {
    const id = !!route.paramMap.get('id') ? String(route.paramMap.get('id')) : null;
    if (!id) {
      return this.getInitialTravel();
    }
    this.getTravelData(id);
    return this.waitForTravelDataToLoad(id);
  }

  getInitialTravel() {
    return new TravelModel();
  }

  getTravelData(id: string) {
    this.store.select(selectTravelById(id)).pipe(
      take(1)
    ).subscribe(travelStored => {
      console.log('travelStored', travelStored);
      if (!travelStored) {
        this.store.dispatch(new GetTravel({ id }));
      }
    });
  }

  waitForTravelDataToLoad(id: string): Observable<TravelModel> {
    return this.store.select(selectTravelById(id)).pipe(
      filter(travel => !!travel),
      take(1),
      // timeout(5000),
      // catchError(() => of(this.getInitialTravel()))
    );
  }
}
