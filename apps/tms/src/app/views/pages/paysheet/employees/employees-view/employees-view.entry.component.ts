import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from '@tms/models';
import { EmployeesViewComponent } from './employees-view.component';

@Component({
  template: '',
})
export class EmployeesViewEntryComponent {
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.openDialog();
  }

  openDialog(): void {
    const employee = this.route.snapshot.data.employee as EmployeeModel;
    const dialogRef = this.dialog.open(EmployeesViewComponent, {
      data: { employee }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
      this.location.back();
    });
  }
}
