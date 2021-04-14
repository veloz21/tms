import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeModel } from '@tms/models';

@Component({
  selector: 'b404-employees-view',
  templateUrl: './employees-view.component.html',
  styleUrls: ['./employees-view.component.scss']
})
export class EmployeesViewComponent implements OnInit {

  public employee: EmployeeModel;
  constructor(
    private dialogRef: MatDialogRef<EmployeesViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { employee: EmployeeModel },
  ) { }

  ngOnInit() {
    this.employee = this.data.employee;
  }

  close() {
    this.dialogRef.close();
  }

}
