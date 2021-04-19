import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TireModel } from '@tms/models';
import { TiresViewComponent } from './tires-view.component';

@Component({
  template: '',
})
export class TiresViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const tire = this.route.snapshot.data.tire as TireModel;
    const dialogRef = this.dialog.open(TiresViewComponent, {
      data: { tire }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}

