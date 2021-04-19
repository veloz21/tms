import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeModel } from '@tms/models';
import { EmployeeResolver } from '@tms/resolvers';
import { EmployeesViewComponent } from './employees-view.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeesViewService {

  constructor(
    public dialog: MatDialog,
    private employeeResolver: EmployeeResolver,
  ) { }

  openEmployeeView(id: string) {
    const resolve = this.employeeResolver.manualResolve(id);
    if (resolve instanceof EmployeeModel) {
      return this.openDialog(resolve);
    }

    resolve.subscribe(employee => {
      this.openDialog(employee);
    });
  }

  private openDialog(employee: EmployeeModel): void {
    const dialogRef = this.dialog.open(EmployeesViewComponent, {
      data: { employee }
    });
    dialogRef.afterClosed().subscribe((preventBackOnDialogClose) => {
      if (!!preventBackOnDialogClose) {
        return;
      }
    });
  }
}
