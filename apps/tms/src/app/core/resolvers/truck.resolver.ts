import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { TruckModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTruckById } from '@tms/selectors/trucks.selectors';
import { TrucksService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TruckResolver implements Resolve<TruckModel> {
  constructor(private trucksService: TrucksService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<TruckModel> | Promise<TruckModel> | TruckModel {
    const id = !!route.paramMap.get('id') ? String(route.paramMap.get('id')) : null;
    if (!id) {
      return this.getInitialTruck(id);
    }
    this.getTruckData(id);
    return this.waitForTruckDataToLoad(id);
  }

  getInitialTruck(id: string) {
    return new TruckModel();
  }

  getTruckData(id: string) {
    this.store.select(selectTruckById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.trucksService.getTruckById(id);
      }
    });
  }

  waitForTruckDataToLoad(id: string): Observable<TruckModel> {
    return this.store.select(selectTruckById(id)).pipe(
      filter(truck => !!truck),
      take(1)
    );
  }
}
