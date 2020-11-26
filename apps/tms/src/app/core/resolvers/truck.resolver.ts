import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Truck } from '@tms/interfaces';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTruckById } from '@tms/selectors/trucks.selectors';
import { TrucksService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TruckResolver implements Resolve<Truck> {
  constructor(private trucksService: TrucksService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Truck> | Promise<Truck> | Truck {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialTruck(id);
    }
    this.getTruckData(id);
    return this.waitForTruckDataToLoad(id);
  }

  getInitialTruck(id: number) {
    return new TruckModel();
  }
  getTruckData(id: number) {
    this.store.select(selectTruckById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.trucksService.getTruckById(id);
      }
    });
  }

  waitForTruckDataToLoad(id: number): Observable<Truck> {
    return this.store.select(selectTruckById(id)).pipe(
      filter(truck => !!truck),
      take(1)
    );
  }
}
