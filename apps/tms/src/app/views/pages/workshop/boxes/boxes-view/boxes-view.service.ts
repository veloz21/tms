import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoxModel } from '@tms/models';
import { BoxResolver } from '@tms/resolvers';
import { BoxesViewComponent } from './boxes-view.component';

@Injectable()
export class BoxesViewService {

  constructor(
    public dialog: MatDialog,
    private boxResolver: BoxResolver,
  ) { }

  openBoxView(id: string) {
    const resolve = this.boxResolver.manualResolve(id);
    if (resolve instanceof BoxModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(box => {
      this.openDialog(box);
    });
  }

  private openDialog(box: BoxModel): void {
    const dialogRef = this.dialog.open(BoxesViewComponent, {
      data: { box }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }

}
