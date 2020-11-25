import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { InfoDialogComponent } from './info-dialog.component';

@NgModule({
  declarations: [InfoDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class InfoDialogModule { }
