import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./tires-list/tires-list.module').then(m => m.TireListModule),
      },
      {
        path: 'add',
        loadChildren: () => import('./tires-edit/tires-edit.module').then(m => m.TireEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./tires-edit/tires-edit.module').then(m => m.TireEditModule),
      },
      {
        path: 'edit/:_id',
        loadChildren: () => import('./tires-edit/tires-edit.module').then(m => m.TireEditModule),
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
export class TireModule {
}
