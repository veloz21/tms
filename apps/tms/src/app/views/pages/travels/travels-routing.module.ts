import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedGuard } from 'ngx-auth';
import { TravelsComponent } from './travels.component';

const routes: Routes = [
  {
    path: '',
    component: TravelsComponent,
    canActivate: [ProtectedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./travels-list/travels-list.module').then(m => m.TravelListModule),
      },
      {
        path: 'add',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
      },
      {
        path: 'edit',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelsRoutingModule { }