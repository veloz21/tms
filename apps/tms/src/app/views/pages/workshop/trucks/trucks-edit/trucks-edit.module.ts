import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TruckEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { ActionNotificationComponent, DeleteEntityDialogComponent } from '@tms/partials/content/crud';
import { PartialsModule } from '@tms/partials/partials.module';
import { trucksReducer } from '@tms/reducers';
import { TruckResolver } from '@tms/resolvers';
import { TrucksService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TrucksViewService } from '../trucks-view/trucks-view.service';
import { TrucksEditComponent } from './trucks-edit.component';

const routes: Routes = [
  {
    path: '',
    component: TrucksEditComponent,
    resolve: {
      truck: TruckResolver
    }
  },
  {
    path: ':id',
    component: TrucksEditComponent,
    resolve: {
      truck: TruckResolver
    }
  }
];

@NgModule({
  declarations: [TrucksEditComponent],
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('trucks', trucksReducer),
    EffectsModule.forFeature([TruckEffects]),
    SharedModule,
  ],
  providers: [
    TrucksService,
    TruckResolver,
    TrucksViewService,
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
})
export class TrucksEditModule { }
