import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@tms/core/core.module';
import { PartialsModule } from '@tms/partials/partials.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    PartialsModule,
    DashboardRoutingModule,
  ],
  providers: [],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {
}
