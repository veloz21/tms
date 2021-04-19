import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TravelModel } from '@tms/models';
import { TravelResolver } from '@tms/resolvers';
import { TravelsViewComponent } from './travels-view.component';

@Injectable({
  providedIn: 'root'
})
export class TravelsViewService {

  constructor(
    public dialog: MatDialog,
    private travelResolver: TravelResolver,
  ) { }

  openTravelView(id: string) {
    const resolve = this.travelResolver.manualResolve(id);
    if (resolve instanceof TravelModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(travel => {
      this.openDialog(travel);
    });
  }

  private openDialog(travel: TravelModel): void {
    const dialogRef = this.dialog.open(TravelsViewComponent, {
      data: { travel }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }
}
