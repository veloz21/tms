import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { TravelEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from '@tms/partials/content/crud';
import { PartialsModule } from '@tms/partials/partials.module';
import { travelsReducer } from '@tms/reducers';
import { TravelResolver, TravelStatusResolver } from '@tms/resolvers';
import { TravelsService } from '@tms/services';
import { BoxesAutocompleteModule } from '@tms/shared/autocomplete/boxes-autocomplete/boxes-autocomplete.module';
import { EmployeesAutocompleteModule } from '@tms/shared/autocomplete/employees-autocomplete/employees-autocomplete.module';
import { PlacesComponent } from '@tms/shared/autocomplete/places-autocomplete/places-autocomplete.component';
import { TrucksAutocompleteModule } from '@tms/shared/autocomplete/trucks-autocomplete/trucks-autocomplete.module';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ExpensesModule } from '../expenses/expenses.module';
import { TravelsViewService } from '../travels-view/travels-view.service';
import { TravelsEditComponent } from './travels-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TravelsEditComponent,
    resolve: {
      travel: TravelResolver,
      travelStatus: TravelStatusResolver,
    },
  },
  {
    path: ':id',
    component: TravelsEditComponent,
    resolve: {
      travel: TravelResolver,
      travelStatus: TravelStatusResolver,
    },
  },
];

@NgModule({
  declarations: [TravelsEditComponent, PlacesComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    PartialsModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatTabsModule,
    ExpensesModule,
    ReactiveFormsModule,
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
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    StoreModule.forFeature('travels', travelsReducer),
    EffectsModule.forFeature([TravelEffects]),
    SharedModule,
    BoxesAutocompleteModule,
    TrucksAutocompleteModule,
    EmployeesAutocompleteModule,
  ],
  providers: [
    TravelsService,
    TravelResolver,
    TravelsViewService,
    TravelStatusResolver,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
})
export class TravelsEditModule { }
