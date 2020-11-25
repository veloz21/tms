import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog.component';

@NgModule({
  declarations: [ErrorDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [ErrorDialogComponent]
})
export class ErrorDialogModule { }
