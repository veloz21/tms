import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatTooltipModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { ModuleGuard } from '@core/auth';
import { HttpUtilsService, InterceptService, LayoutUtilsService, TypesUtilsService } from '@crud';
import { BoxEffects } from '@effects';
import { environment } from '@environments/environment';
import { FakeApiService } from '@layout';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ActionNotificationComponent, DeleteEntityDialogComponent, FetchEntityDialogComponent, UpdateStatusDialogComponent } from '@partials/content/crud';
import { PartialsModule } from '@partials/partials.module';
import { boxesReducer } from '@reducers';
import { BoxResolver } from '@resolvers';
import { BoxesService } from '@services';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BoxesEditComponent } from './boxes-edit.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
  {
    path: '',
    component: BoxesEditComponent,
    resolve: {
      box: BoxResolver
    }
  },
  {
    path: ':id',
    component: BoxesEditComponent,
    resolve: {
      box: BoxResolver
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
    FormsModule,
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
    StoreModule.forFeature('boxes', boxesReducer),
    EffectsModule.forFeature([BoxEffects]),
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
    BoxesService,
    TypesUtilsService,
    LayoutUtilsService,
    BoxResolver
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
  ],
  declarations: [
		BoxesEditComponent
	]
})
export class BoxEditModule { }
