import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxModel } from '@tms/models';

@Component({
  selector: 'b404-boxes-view',
  templateUrl: './boxes-view.component.html',
  styleUrls: ['./boxes-view.component.scss']
})
export class BoxesViewComponent implements OnInit {

  public box: BoxModel;
  constructor(
    private dialogRef: MatDialogRef<BoxesViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { box: BoxModel },
  ) { }

  ngOnInit() {
    this.box = this.data.box;
  }

  close() {
    this.dialogRef.close();
  }

}
