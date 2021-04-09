import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetTire } from '@tms/actions/tire.actions';
import { TireModel } from '@tms/models';
import { selectTireById } from '@tms/selectors/tire.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class TireResolver extends BaseResolver<TireModel> implements Resolve<TireModel> {
  protected backRoute: string = '/workshop/tires';
  protected getEmptyModel(): TireModel {
    return new TireModel();
  }

  protected getModelAction(id: string): GetTire {
    return new GetTire({ id });
  }

  protected selectModelFromStore(id: string): Observable<TireModel> {
    return this.store.select(selectTireById(id));
  }
}
