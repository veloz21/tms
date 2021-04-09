import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { TravelStatusModel } from '../../../../../core/models';
import { DeleteDialogComponent } from '../../../../shared/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'b404-change-status-dialog',
  templateUrl: './change-status-dialog.component.html',
  styleUrls: ['./change-status-dialog.component.scss']
})
export class ChangeStatusDialogComponent implements OnInit {

  status: TravelStatusModel;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { status: TravelStatusModel, }
  ) { }

  ngOnInit(): void {
    this.status = this.data.status;

    const date = this.status.date ? new Date(this.status.date) : new Date(this.status.date);
    const time: NgbTimeStruct = { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };

    this.form = this.fb.group({
      id: [this.status.id],
      date: [this.status.date, [Validators.required]],
      datetime: [time],
      name: [this.status.name],
      comments: [this.status.comments],
    });
  }

  prepareStatus(): TravelStatusModel {
    const date: Date = this.form.get('date').value;
    const time: NgbTimeStruct = this.form.get('datetime').value;
    date.setHours(time.hour);
    date.setMinutes(time.minute);

    return new TravelStatusModel({
      id: this.form.get('id').value,
      date,
      name: this.form.get('name').value,
      comments: this.form.get('comments').value,
    });
  }

  onYesClick() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.prepareStatus());
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

}
