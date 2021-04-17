import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceModel } from '@tms/models';

@Component({
  selector: 'b404-maintenances-view',
  templateUrl: './maintenances-view.component.html',
  styleUrls: ['./maintenances-view.component.scss']
})
export class MaintenancesViewComponent implements OnInit {

  public maintenance: MaintenanceModel;
  constructor(
    private dialogRef: MatDialogRef<MaintenancesViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { maintenance: MaintenanceModel },
  ) { }

  ngOnInit() {
    this.maintenance = this.data.maintenance;
  }

  close() {
    this.dialogRef.close();
  }

}
