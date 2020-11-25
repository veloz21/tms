import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Tire } from '@interfaces';
import { TireModel } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectTireById } from '@selectors/tire.selectors';
import { TiresService } from '@services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TireResolver implements Resolve<Tire> {
  constructor(private tiresService: TiresService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Tire> | Promise<Tire> | Tire {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialTire(id);
    }
    this.getTireData(id);
    return this.waitForTireDataToLoad(id);
  }

  getInitialTire(id: number) {
    return new TireModel();
  }
  getTireData(id: number) {
    this.store.select(selectTireById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.tiresService.getTireById(id);
      }
    });
  }

  waitForTireDataToLoad(id: number): Observable <Tire> {
    return this.store.select(selectTireById(id)).pipe(
      filter(tire => !!tire),
      take(1)
    );
  }
}
