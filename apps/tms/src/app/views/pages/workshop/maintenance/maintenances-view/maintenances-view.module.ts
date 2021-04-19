import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { BoxEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { maintenancesReducer } from '@tms/reducers';
import { MaintenanceResolver } from '@tms/resolvers';
import { MaintenancesService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MaintenancesViewComponent } from './maintenances-view.component';
import { MaintenancesViewEntryComponent } from './maintenances-view.entry.component';
import { MaintenancesViewService } from './maintenances-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: MaintenancesViewEntryComponent,
    resolve: {
      maintenance: MaintenanceResolver
    }
  }
];

@NgModule({
  declarations: [MaintenancesViewComponent, MaintenancesViewEntryComponent],
  imports: [
    CommonModule,
    PartialsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('maintenances', maintenancesReducer),
    EffectsModule.forFeature([BoxEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    MaintenancesService,
    MaintenanceResolver,
    MaintenancesViewService,
  ],
})
export class MaintenancesViewModule { }
