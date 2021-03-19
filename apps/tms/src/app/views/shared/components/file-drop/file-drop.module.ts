import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileDropComponent } from './file-drop.component';

@NgModule({
  declarations: [FileDropComponent],
  imports: [
    CommonModule,
    NgxFileDropModule,
  ],
  exports: [FileDropComponent]
})
export class FileDropModule { }
