import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TravelModel } from '@tms/models';
import { TravelsViewComponent } from './travels-view.component';

@Component({
  template: '',
})
export class TravelsViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const travel = this.route.snapshot.data.travel as TravelModel;
    const dialogRef = this.dialog.open(TravelsViewComponent, {
      data: { travel }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}
