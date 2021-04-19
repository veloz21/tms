import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceModel } from '@tms/models';
import { MaintenanceResolver } from '@tms/resolvers';
import { MaintenancesViewComponent } from './maintenances-view.component';

@Injectable()
export class MaintenancesViewService {

  constructor(
    public dialog: MatDialog,
    private maintenanceResolver: MaintenanceResolver,
  ) { }

  openMaintenanceView(id: string) {
    const resolve = this.maintenanceResolver.manualResolve(id);
    if (resolve instanceof MaintenanceModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(maintenance => {
      this.openDialog(maintenance);
    });
  }

  private openDialog(maintenance: MaintenanceModel): void {
    const dialogRef = this.dialog.open(MaintenancesViewComponent, {
      data: { maintenance }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }

}
