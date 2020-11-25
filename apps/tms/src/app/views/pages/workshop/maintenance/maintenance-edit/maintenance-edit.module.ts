import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from '@crud';
import { MaintenanceEffects } from '@effects';
import { environment } from '@environments/environment';
import { FakeApiService } from '@layout';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '@partials/content/crud';
import { PartialsModule } from '@partials/partials.module';
import { maintenancesReducer } from '@reducers';
import { MaintenanceResolver } from '@resolvers';
import { BoxesService, EmployeesService, MaintenancesService, TrucksService } from '@services';
import { BoxesAutocompleteModule } from '@shared/autocomplete/boxes-autocomplete/boxes-autocomplete.module';
import { EmployeesAutocompleteModule } from '@shared/autocomplete/employees-autocomplete/employees-autocomplete.module';
import { TrucksAutocompleteModule } from '@shared/autocomplete/trucks-autocomplete/trucks-autocomplete.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ModuleGuard } from '../../../../../core/auth';
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
    HttpClientModule,
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
    ModuleGuard,
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
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
