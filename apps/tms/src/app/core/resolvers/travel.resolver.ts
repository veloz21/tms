import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetTravel } from '@tms/actions/travel.actions';
import { TravelModel } from '@tms/models';
import { selectTravelById } from '@tms/selectors/travel.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class TravelResolver extends BaseResolver<TravelModel> implements Resolve<TravelModel> {

  protected backRoute: string = '/travels';
  protected getEmptyModel(): TravelModel {
    return new TravelModel();
  }

  protected getModelAction(id: string): GetTravel {
    return new GetTravel({ id });
  }

  protected selectModelFromStore(id: string): Observable<TravelModel> {
    return this.store.select(selectTravelById(id));
  }
}
