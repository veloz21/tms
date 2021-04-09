import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TravelModel } from '@tms/models';
import { Observable } from 'rxjs';
import { GetCompletedTravel } from '../actions/completed-travel.actions';
import { CompletedTravelModel } from '../models/completed-travel.model';
import { selectCompletedTravelById } from '../selectors/completed-travel.selectors';
import { BaseResolver } from './base-resolver';

@Injectable()
export class CompletedTravelResolver extends BaseResolver<CompletedTravelModel> implements Resolve<TravelModel> {

  protected backRoute: string = '/travels';
  protected getEmptyModel(): CompletedTravelModel {
    return new CompletedTravelModel();
  }

  protected getModelAction(id: string): GetCompletedTravel {
    return new GetCompletedTravel({ id });
  }

  protected selectModelFromStore(id: string): Observable<CompletedTravelModel> {
    return this.store.select(selectCompletedTravelById(id));
  }
}
