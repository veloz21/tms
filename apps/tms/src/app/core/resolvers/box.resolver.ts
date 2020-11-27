import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { BoxModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectBoxById } from '@tms/selectors/boxes.selectors';
import { BoxesService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class BoxResolver implements Resolve<BoxModel> {
  constructor(private boxesService: BoxesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<BoxModel> | Promise<BoxModel> | BoxModel {
    const id = !!route.paramMap.get('id') ? String(route.paramMap.get('id')) : null;
    if (!id) {
      return this.getInitialBox(id);
    }
    this.getBoxData(id);
    return this.waitForBoxDataToLoad(id);
  }

  getInitialBox(id: string) {
    return new BoxModel();
  }

  getBoxData(id: string) {
    this.store.select(selectBoxById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.boxesService.getBoxById(id);
      }
    });
  }

  waitForBoxDataToLoad(id: string): Observable<BoxModel> {
    return this.store.select(selectBoxById(id)).pipe(
      filter(box => !!box),
      take(1)
    );
  }
}
