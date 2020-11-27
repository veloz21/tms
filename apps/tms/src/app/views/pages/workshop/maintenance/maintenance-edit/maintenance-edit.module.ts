import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { HttpUtilsService, LayoutUtilsService, TypesUtilsService } from '@tms/crud';
import { MaintenanceEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '@tms/partials/content/crud';
import { PartialsModule } from '@tms/partials/partials.module';
import { maintenancesReducer } from '@tms/reducers';
import { MaintenanceResolver } from '@tms/resolvers';
import { BoxesService, EmployeesService, MaintenancesService, TrucksService } from '@tms/services';
import { BoxesAutocompleteModule } from '@tms/shared/autocomplete/boxes-autocomplete/boxes-autocomplete.module';
import { EmployeesAutocompleteModule } from '@tms/shared/autocomplete/employees-autocomplete/employees-autocomplete.module';
import { TrucksAutocompleteModule } from '@tms/shared/autocomplete/trucks-autocomplete/trucks-autocomplete.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MaintenanceEditComponent } from './maintenance-edit.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
  {
    path: '',
    component: MaintenanceEditComponent,
    resolve: {
      maintenance: MaintenanceResolver
    }
  },
  {
    path: ':id',
    component: MaintenanceEditComponent,
    resolve: {
      maintenance: MaintenanceResolver
    }
  }
];

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    BoxesAutocompleteModule,
    FormsModule,
    TrucksAutocompleteModule,
    EmployeesAutocompleteModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    NgbProgressbarModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('maintenance', maintenancesReducer),
    EffectsModule.forFeature([MaintenanceEffects]),
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'b404-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    TypesUtilsService,
    HttpUtilsService,
    MaintenancesService,
    TypesUtilsService,
    LayoutUtilsService,
    MaintenanceResolver,
    TrucksService,
    BoxesService,
    EmployeesService
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
  declarations: [
    MaintenanceEditComponent
  ]
})
export class MaintenanceEditModule { }
