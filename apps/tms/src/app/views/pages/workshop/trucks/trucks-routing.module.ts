import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./trucks-list/trucks-list.module').then(m => m.TruckListModule)
      },
      {
        path: 'add',
        loadChildren: () => import('./truck-edit/truck-edit.module').then(m => m.TruckEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./truck-edit/truck-edit.module').then(m => m.TruckEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./truck-edit/truck-edit.module').then(m => m.TruckEditModule),
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
export class TrucksRoutingModule { }