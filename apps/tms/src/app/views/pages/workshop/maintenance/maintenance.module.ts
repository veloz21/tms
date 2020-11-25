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
        loadChildren: () => import('./maintenance-edit/maintenance-edit.module').then(m => m.MaintenanceEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./maintenance-edit/maintenance-edit.module').then(m => m.MaintenanceEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./maintenance-edit/maintenance-edit.module').then(m => m.MaintenanceEditModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  entryComponents: [],
  declarations: []
})
export class MaintenanceModule { }
