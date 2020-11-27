import { NgModule } from '@angular/core';
import { DeleteDialogComponent } from '@tms/shared/dialogs/delete-dialog/delete-dialog.component';
import { DeleteDialogModule } from '@tms/shared/dialogs/delete-dialog/delete-dialog.module';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { WorkshopComponent } from './workshop.component';

@NgModule({
  imports: [
    WorkshopRoutingModule,
    DeleteDialogModule
  ],
  providers: [],
  entryComponents: [DeleteDialogComponent],
  declarations: [WorkshopComponent]
})
export class WorkshopModule { }
