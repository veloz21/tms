import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@tms/models';
import { UsersViewComponent } from './users-view.component';

@Component({
  template: '',
})
export class UsersViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const user = this.route.snapshot.data.user as UserModel;
    const dialogRef = this.dialog.open(UsersViewComponent, {
      data: { user }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}

