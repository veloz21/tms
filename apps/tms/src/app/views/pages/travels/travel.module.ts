import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedGuard } from 'ngx-auth';
import { TravelComponent } from './travel.component';
const routes: Routes = [
  {
    path: 'travel',
    canActivate: [ProtectedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./travels-list/travels-list.module').then(m => m.TravelListModule)
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [],
  entryComponents: [],
  declarations: [TravelComponent]
})
export class TravelModule { }
