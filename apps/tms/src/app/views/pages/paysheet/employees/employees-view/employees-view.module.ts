import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { EmployeeEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { employeesReducer } from '@tms/reducers';
import { EmployeeResolver } from '@tms/resolvers';
import { EmployeesService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { EmployeesViewComponent } from './employees-view.component';
import { EmployeesViewEntryComponent } from './employees-view.entry.component';

const routes: Route[] = [
  {
    path: ':id',
    component: EmployeesViewEntryComponent,
    resolve: {
      employee: EmployeeResolver
    }
  }
];

@NgModule({
  declarations: [EmployeesViewComponent, EmployeesViewEntryComponent],
  imports: [
    CommonModule,
    PartialsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('employees', employeesReducer),
    EffectsModule.forFeature([EmployeeEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    EmployeesService,
    EmployeeResolver
  ],
})
export class EmployeesViewModule { }
