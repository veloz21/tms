import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TireModel } from '@tms/models';

@Component({
  selector: 'b404-tires-view',
  templateUrl: './tires-view.component.html',
  styleUrls: ['./tires-view.component.scss']
})
export class TiresViewComponent implements OnInit {

  public tire: TireModel;
  constructor(
    private dialogRef: MatDialogRef<TiresViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { tire: TireModel },
  ) { }

  ngOnInit() {
    this.tire = this.data.tire;
  }

  close() {
    this.dialogRef.close();
  }

}
