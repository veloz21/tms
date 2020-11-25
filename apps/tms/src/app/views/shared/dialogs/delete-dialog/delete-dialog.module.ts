import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DeleteDialogComponent } from './delete-dialog.component';

@NgModule({
  declarations: [DeleteDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressBarModule,
  ],
  exports: [DeleteDialogComponent]
})
export class DeleteDialogModule { }
