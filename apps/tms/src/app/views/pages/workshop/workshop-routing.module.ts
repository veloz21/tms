import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
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
    loadChildren: () => import('./tires/tires.module').then(m => m.TiresModule),
  }
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class WorkshopRoutingModule { }