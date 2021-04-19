import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TireModel } from '@tms/models';
import { TireResolver } from '@tms/resolvers';
import { TiresViewComponent } from './tires-view.component';

@Injectable()
export class TiresViewService {

  constructor(
    public dialog: MatDialog,
    private tireResolver: TireResolver,
  ) { }

  openTireView(id: string) {
    const resolve = this.tireResolver.manualResolve(id);
    if (resolve instanceof TireModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(tire => {
      this.openDialog(tire);
    });
  }

  private openDialog(tire: TireModel): void {
    const dialogRef = this.dialog.open(TiresViewComponent, {
      data: { tire }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }

}
