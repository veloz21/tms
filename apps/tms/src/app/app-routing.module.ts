import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtectedGuard, PublicGuard } from 'ngx-auth';
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [PublicGuard],
    loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: BaseComponent,
    canActivate: [ProtectedGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'workshop',
        loadChildren: () => import('./views/pages/workshop/workshop.module').then(m => m.WorkshopModule),
      },
      {
        path: 'paysheet',
        loadChildren: () => import('./views/pages/paysheet/paysheet.module').then(m => m.PaysheetModule),
      },
      {
        path: 'travels',
        loadChildren: () => import('./views/pages/travels/travel.module').then(m => m.TravelModule),
      },
      {
        path: 'wizard',
        loadChildren: () => import('./views/pages/wizard/wizard.module').then(m => m.WizardModule),
      },
      {
        path: 'error/403',
        component: ErrorPageComponent,
        data: {
          type: 'error-v6',
          code: 403,
          title: '403... Access forbidden',
          desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator',
        },
      },
      { path: 'error/:type', component: ErrorPageComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

