import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Maintenance } from '@tms/interfaces';
import { MaintenanceModel } from '@tms/models';
import { AppState } from '@tms/reducers';
import { selectMaintenanceById } from '@tms/selectors/maintenance.selectors';
import { MaintenancesService } from '@tms/services';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Injectable()
export class MaintenanceResolver implements Resolve<Maintenance> {
  constructor(private maintenancesService: MaintenancesService, private store: Store<AppState>) { }
  resolve(route: ActivatedRouteSnapshot): Observable<Maintenance> | Promise<Maintenance> | Maintenance {
    const id = Number(route.paramMap.get('id'));
    if (id === 0) {
      return this.getInitialMaintenance(id);
    }
    this.getMaintenanceData(id);
    return this.waitForMaintenanceDataToLoad(id);
  }

  getInitialMaintenance(id: number) {
    return new MaintenanceModel();
  }
  getMaintenanceData(id: number) {
    this.store.select(selectMaintenanceById(id)).pipe(
      take(1)
    ).subscribe(maintenanceStored => {
      if (!maintenanceStored) {
        return this.maintenancesService.getMaintenanceById(id);
      }
    });
  }

  waitForMaintenanceDataToLoad(id: number): Observable<Maintenance> {
    return this.store.select(selectMaintenanceById(id)).pipe(
      filter(maintenance => !!maintenance),
      take(1)
    );
  }
}
