import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./maintenances-list/maintenances-list.module').then(m => m.MaintenancesListModule)
      },
      {
        path: 'add',
        loadChildren: () => import('./maintenances-edit/maintenances-edit.module').then(m => m.MaintenancesEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./maintenances-edit/maintenances-edit.module').then(m => m.MaintenancesEditModule),
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MaintenancesRoutingModule { }