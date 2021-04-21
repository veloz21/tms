import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./users-list/users-list.module').then(m => m.UsersListModule),
      },
      {
        path: 'add',
        loadChildren: () => import('./users-edit/users-edit.module').then(m => m.UsersEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./users-edit/users-edit.module').then(m => m.UsersEditModule),
      },
      {
        path: 'edit/:_id',
        loadChildren: () => import('./users-edit/users-edit.module').then(m => m.UsersEditModule),
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
export class UsersRoutingModule { }