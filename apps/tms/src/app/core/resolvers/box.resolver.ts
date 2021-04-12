import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetBox } from '@tms/actions/box.actions';
import { BoxModel } from '@tms/models';
import { selectBoxById } from '@tms/selectors/boxes.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class BoxResolver extends BaseResolver<BoxModel> implements Resolve<BoxModel> {

  protected backRoute: string = '/workshop/boxes';
  protected getEmptyModel(): BoxModel {
    return new BoxModel();
  }

  protected getModelAction(id: string): GetBox {
    return new GetBox({ id });
  }

  protected selectModelFromStore(id: string): Observable<BoxModel> {
    return this.store.select(selectBoxById(id));
  }
}
