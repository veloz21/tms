import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./boxes-list/boxes-list.module').then(m => m.BoxListModule),
      },
      {
        path: 'add',
        loadChildren: () => import('./boxes-edit/boxes-edit.module').then(m => m.BoxEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./boxes-edit/boxes-edit.module').then(m => m.BoxEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./boxes-edit/boxes-edit.module').then(m => m.BoxEditModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class BoxesRoutingModule { }