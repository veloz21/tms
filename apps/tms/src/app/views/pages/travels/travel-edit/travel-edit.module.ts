// Angular
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from '@crud';
import { TravelEffects } from '@effects';
import { environment } from '@environments/environment';
import { FakeApiService } from '@layout';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '@partials/partials.module';
import { travelsReducer } from '@reducers';
import { TravelResolver } from '@resolvers';
import { BoxesService, EmployeesService, TravelsService, TrucksService } from '@services';
import { BoxesAutocompleteModule } from '@shared/autocomplete/boxes-autocomplete/boxes-autocomplete.module';
import { EmployeesAutocompleteModule } from '@shared/autocomplete/employees-autocomplete/employees-autocomplete.module';
import { TrucksAutocompleteModule } from '@shared/autocomplete/trucks-autocomplete/trucks-autocomplete.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ModuleGuard } from '../../../../core/auth';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '../../../partials/content/crud';
import { TravelEditComponent } from './travel-edit.component';
// tslint:disable-next-line:class-name
const routes: Routes = [
  {
    path: '',
    component: TravelEditComponent,
    resolve: {
      travel: TravelResolver
    }
  },
  {
    path: ':id',
    component: TravelEditComponent,
    resolve: {
      travel: TravelResolver
    }
  }
];

@NgModule({
  imports: [
    MatDialogModule,
    CommonModule,
    NgbModule,
    HttpClientModule,
    PartialsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    BoxesAutocompleteModule,
    EmployeesAutocompleteModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    TrucksAutocompleteModule,
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
    StoreModule.forFeature('travels', travelsReducer),
    EffectsModule.forFeature([TravelEffects]),
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
    LayoutUtilsService,
    HttpUtilsService,
    TravelsService,
    TypesUtilsService,
    TravelResolver,
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
    TravelEditComponent
  ]
})
export class TravelEditModule { }
