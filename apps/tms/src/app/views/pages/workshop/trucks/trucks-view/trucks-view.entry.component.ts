import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TruckModel } from '@tms/models';
import { TrucksViewComponent } from './trucks-view.component';

@Component({
  template: '',
})
export class TrucksViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const truck = this.route.snapshot.data.truck as TruckModel;
    const dialogRef = this.dialog.open(TrucksViewComponent, {
      data: { truck }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}

