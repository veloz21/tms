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
        loadChildren: () => import('./trucks-edit/trucks-edit.module').then(m => m.TrucksEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./trucks-edit/trucks-edit.module').then(m => m.TrucksEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./trucks-edit/trucks-edit.module').then(m => m.TrucksEditModule),
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