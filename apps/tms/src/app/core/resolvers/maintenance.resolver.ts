import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { MaintenanceModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectMaintenanceById } from '@tms/selectors/maintenance.selectors';
import { MaintenancesService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class MaintenanceResolver implements Resolve<MaintenanceModel> {
  constructor(private maintenancesService: MaintenancesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<MaintenanceModel> | Promise<MaintenanceModel> | MaintenanceModel {
    const id = String(route.paramMap.get('id'));
    if (!id) {
      return this.getInitialMaintenance(id);
    }
    this.getMaintenanceData(id);
    return this.waitForMaintenanceDataToLoad(id);
  }

  getInitialMaintenance(id: string) {
    return new MaintenanceModel();
  }
  getMaintenanceData(id: string) {
    this.store.select(selectMaintenanceById(id)).pipe(
      take(1)
    ).subscribe(maintenanceStored => {
      if (!maintenanceStored) {
        return this.maintenancesService.getMaintenanceById(id);
      }
    });
  }

  waitForMaintenanceDataToLoad(id: string): Observable<MaintenanceModel> {
    return this.store.select(selectMaintenanceById(id)).pipe(
      filter(maintenance => !!maintenance),
      take(1)
    );
  }
}
