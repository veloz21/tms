import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Travel } from '@tms/interfaces';
import { TravelModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTravelById } from '@tms/selectors/travel.selectors';
import { TravelsService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TravelResolver implements Resolve<Travel> {
  constructor(private travelsService: TravelsService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Travel> | Promise<Travel> | Travel {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialTravel(id);
    }
    this.getTravelData(id);
    return this.waitForTravelDataToLoad(id);
  }

  getInitialTravel(id: number) {
    return new TravelModel();
  }
  getTravelData(id: number) {
    this.store.select(selectTravelById(id)).pipe(
      take(1)
    ).subscribe(travelStored => {
      if (!travelStored) {
        return this.travelsService.getTravelById(id);
      }
    });
  }

  waitForTravelDataToLoad(id: number): Observable<Travel> {
    return this.store.select(selectTravelById(id)).pipe(
      filter(travel => !!travel),
      take(1)
    );
  }
}
