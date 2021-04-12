import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetMaintenance } from '@tms/actions/maintenance.actions';
import { MaintenanceModel } from '@tms/models';
import { selectMaintenanceById } from '@tms/selectors/maintenance.selectors';
import { Observable } from 'rxjs';
import { BaseResolver } from './base-resolver';

@Injectable()
export class MaintenanceResolver extends BaseResolver<MaintenanceModel> implements Resolve<MaintenanceModel> {

  protected backRoute: string = '/workshop/maintenances';
  protected getEmptyModel(): MaintenanceModel {
    return new MaintenanceModel();
  }

  protected getModelAction(id: string): GetMaintenance {
    return new GetMaintenance({ id });
  }

  protected selectModelFromStore(id: string): Observable<MaintenanceModel> {
    return this.store.select(selectMaintenanceById(id));
  }
}
