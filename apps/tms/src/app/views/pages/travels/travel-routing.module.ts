import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedGuard } from 'ngx-auth';
import { TravelComponent } from './travel.component';

const routes: Routes = [
  {
    path: '',
    component: TravelComponent,
    canActivate: [ProtectedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./travels-list/travels-list.module').then(m => m.TravelListModule),
        // canActivate: [ProtectedGuard],
      },
      {
        path: 'add',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
        // canActivate: [ProtectedGuard],
      },
      {
        path: 'edit',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
        // canActivate: [ProtectedGuard],
      },
      {
        path: 'edit/:id',
        loadChildren: () => import('./travel-edit/travel-edit.module').then(m => m.TravelEditModule),
        // canActivate: [ProtectedGuard],
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelRoutingModule { }