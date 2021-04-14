import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { EmployeeEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from '@tms/partials/content/crud';
import { PartialsModule } from '@tms/partials/partials.module';
import { employeesReducer } from '@tms/reducers';
import { EmployeeResolver } from '@tms/resolvers';
import { EmployeesService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { EmployeesEditComponent } from './employees-edit.component';

const routes: Route[] = [
  {
    path: '',
    component: EmployeesEditComponent,
    resolve: {
      employee: EmployeeResolver
    }
  },
  {
    path: ':id',
    component: EmployeesEditComponent,
    resolve: {
      employee: EmployeeResolver
    }
  }
];

@NgModule({
  declarations: [EmployeesEditComponent],
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
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
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
})
export class EmployeesEditModule { }
