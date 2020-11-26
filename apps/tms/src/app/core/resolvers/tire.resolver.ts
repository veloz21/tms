import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { TireModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectTireById } from '@tms/selectors/tire.selectors';
import { TiresService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class TireResolver implements Resolve<TireModel> {
  constructor(private tiresService: TiresService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<TireModel> | Promise<TireModel> | TireModel {
    const id = String(route.paramMap.get('id'));
    if (!id) {
      return this.getInitialTire(id);
    }
    this.getTireData(id);
    return this.waitForTireDataToLoad(id);
  }

  getInitialTire(id: string) {
    return new TireModel();
  }
  getTireData(id: string) {
    this.store.select(selectTireById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.tiresService.getTireById(id);
      }
    });
  }

  waitForTireDataToLoad(id: string): Observable<TireModel> {
    return this.store.select(selectTireById(id)).pipe(
      filter(tire => !!tire),
      take(1)
    );
  }
}
