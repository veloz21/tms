import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Box } from '@interfaces';
import { BoxModel } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@reducers';
import { selectBoxById } from '@selectors/boxes.selectors';
import { BoxesService } from '@services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class BoxResolver implements Resolve<Box> {
  constructor(private boxesService: BoxesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Box> | Promise<Box> | Box {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialBox(id);
    }
    this.getBoxData(id);
    return this.waitForBoxDataToLoad(id);
  }

  getInitialBox(id: number) {
    return new BoxModel();
  }
  getBoxData(id: number) {
    this.store.select(selectBoxById(id)).pipe(
      take(1)
    ).subscribe(truckStored => {
      if (!truckStored) {
        return this.boxesService.getBoxById(id);
      }
    });
  }

  waitForBoxDataToLoad(id: number): Observable <Box> {
    return this.store.select(selectBoxById(id)).pipe(
      filter(box => !!box),
      take(1)
    );
  }
}
