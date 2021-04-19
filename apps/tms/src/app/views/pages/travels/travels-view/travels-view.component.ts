import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TravelModel } from '@tms/models';

@Component({
  selector: 'b404-travels-view',
  templateUrl: './travels-view.component.html',
  styleUrls: ['./travels-view.component.scss']
})
export class TravelsViewComponent implements OnInit {

  public travel: TravelModel;
  constructor(
    private dialogRef: MatDialogRef<TravelsViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { travel: TravelModel },
  ) { }

  ngOnInit() {
    this.travel = this.data.travel;
  }

  close() {
    this.dialogRef.close();
  }

}
