import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangeStatusDialogComponent } from './change-status-dialog.component';

@NgModule({
  declarations: [ChangeStatusDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NgbTimepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [ChangeStatusDialogComponent]
})
export class ChangeStatusDialogModule { }
