import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeleteDialogComponent } from '@tms/shared/dialogs/delete-dialog/delete-dialog.component';
import { DeleteDialogModule } from '@tms/shared/dialogs/delete-dialog/delete-dialog.module';
import { WorkshopComponent } from './workshop.component';

const routes: Routes = [{
  path: '',
  // canActivate: [ProtectedGuard],
  children: [{
    path: 'trucks',
    loadChildren: () => import('./trucks/truck.module').then(m => m.TruckModule),
  },
  {
    path: 'maintenances',
    loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
  },
  {
    path: 'boxes',
    loadChildren: () => import('./boxes/boxes.module').then(m => m.BoxModule),
  },
  {
    path: 'tires',
    loadChildren: () => import('./tires/tires.module').then(m => m.TireModule),
  }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DeleteDialogModule
  ],
  providers: [],
  entryComponents: [DeleteDialogComponent],
  declarations: [WorkshopComponent]
})
export class WorkshopModule { }
