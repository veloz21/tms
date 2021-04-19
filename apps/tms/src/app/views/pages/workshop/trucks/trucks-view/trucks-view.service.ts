import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TruckModel } from '@tms/models';
import { TruckResolver } from '@tms/resolvers';
import { TrucksViewComponent } from './trucks-view.component';

@Injectable()
export class TrucksViewService {

  constructor(
    public dialog: MatDialog,
    private truckResolver: TruckResolver,
  ) { }

  openBoxView(id: string) {
    const resolve = this.truckResolver.manualResolve(id);
    if (resolve instanceof TruckModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(truck => {
      this.openDialog(truck);
    });
  }

  private openDialog(truck: TruckModel): void {
    const dialogRef = this.dialog.open(TrucksViewComponent, {
      data: { truck }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }

}
