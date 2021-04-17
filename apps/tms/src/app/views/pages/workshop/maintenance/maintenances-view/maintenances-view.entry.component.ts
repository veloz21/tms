import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MaintenanceModel } from '@tms/models';
import { MaintenancesViewComponent } from './maintenances-view.component';

@Component({
  template: '',
})
export class MaintenancesViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const maintenance = this.route.snapshot.data.maintenance as MaintenanceModel;
    const dialogRef = this.dialog.open(MaintenancesViewComponent, {
      data: { maintenance }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}

