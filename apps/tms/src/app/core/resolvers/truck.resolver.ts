import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetTruck } from '@tms/actions/truck.actions';
import { TruckModel } from '@tms/models';
import { selectTruckById } from '@tms/selectors/trucks.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class TruckResolver extends BaseResolver<TruckModel> implements Resolve<TruckModel> {
  protected backRoute: string = '/workshop/trucks';
  protected getEmptyModel(): TruckModel {
    return new TruckModel();
  }

  protected getModelAction(id: string): GetTruck {
    return new GetTruck({ id });
  }

  protected selectModelFromStore(id: string): Observable<TruckModel> {
    return this.store.select(selectTruckById(id));
  }
}
