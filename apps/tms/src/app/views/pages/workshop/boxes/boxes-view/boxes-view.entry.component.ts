import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BoxModel } from '@tms/models';
import { BoxesViewComponent } from './boxes-view.component';

@Component({
  template: '',
})
export class BoxesViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const box = this.route.snapshot.data.box as BoxModel;
    const dialogRef = this.dialog.open(BoxesViewComponent, {
      data: { box }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}
