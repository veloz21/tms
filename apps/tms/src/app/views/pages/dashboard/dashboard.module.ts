import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { PartialsModule } from '@partials/partials.module';
import { ProtectedGuard } from 'ngx-auth';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    CoreModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        canActivate: [ProtectedGuard],
      },
    ]),
  ],
  providers: [],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule {
}
