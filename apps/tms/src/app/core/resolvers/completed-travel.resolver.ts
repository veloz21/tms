import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetCompletedTravel } from '@tms/actions/completed-travel.actions';
import { CompletedTravelModel, TravelModel } from '@tms/models';
import { selectCompletedTravelById } from '@tms/selectors/completed-travel.selectors';
import { Observable } from 'rxjs';
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
