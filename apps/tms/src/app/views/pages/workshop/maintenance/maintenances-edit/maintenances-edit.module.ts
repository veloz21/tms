import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaintenanceEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from '@tms/partials/content/crud';
import { PartialsModule } from '@tms/partials/partials.module';
import { maintenancesReducer } from '@tms/reducers';
import { MaintenanceResolver } from '@tms/resolvers';
import { MaintenancesService } from '@tms/services';
import { BoxesAutocompleteModule } from '@tms/shared/autocomplete/boxes-autocomplete/boxes-autocomplete.module';
import { EmployeesAutocompleteModule } from '@tms/shared/autocomplete/employees-autocomplete/employees-autocomplete.module';
import { TrucksAutocompleteModule } from '@tms/shared/autocomplete/trucks-autocomplete/trucks-autocomplete.module';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MaintenancesViewService } from '../maintenances-view/maintenances-view.service';
import { MaintenancesEditComponent } from './maintenances-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenancesEditComponent,
    resolve: {
      maintenance: MaintenanceResolver
    }
  },
  {
    path: ':id',
    component: MaintenancesEditComponent,
    resolve: {
      maintenance: MaintenanceResolver
    }
  }
];

@NgModule({
  declarations: [MaintenancesEditComponent],
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    StoreModule.forFeature('maintenances', maintenancesReducer),
    EffectsModule.forFeature([MaintenanceEffects]),
    SharedModule,
    BoxesAutocompleteModule,
    TrucksAutocompleteModule,
    EmployeesAutocompleteModule,
  ],
  providers: [
    MaintenancesService,
    MaintenanceResolver,
    MaintenancesViewService,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
})
export class MaintenancesEditModule { }
