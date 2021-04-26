import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@tms/shared/shared.module';
import { TiresSharedEditRowComponent } from './tires-shared-edit-row/tires-shared-edit-row.component';
import { TiresSharedEditComponent } from './tires-shared-edit.component';

@NgModule({
  declarations: [TiresSharedEditComponent, TiresSharedEditRowComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    DragDropModule,
  ],
  exports: [TiresSharedEditComponent, TiresSharedEditRowComponent]
})
export class TiresSharedEditModule { }
