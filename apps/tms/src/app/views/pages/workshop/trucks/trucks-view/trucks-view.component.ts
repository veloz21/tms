import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TruckModel } from '@tms/models';

@Component({
  selector: 'b404-trucks-view',
  templateUrl: './trucks-view.component.html',
  styleUrls: ['./trucks-view.component.scss']
})
export class TrucksViewComponent implements OnInit {

  public truck: TruckModel;
  constructor(
    private dialogRef: MatDialogRef<TrucksViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { truck: TruckModel },
  ) { }

  ngOnInit() {
    this.truck = this.data.truck;
  }

  close() {
    this.dialogRef.close();
  }

}
