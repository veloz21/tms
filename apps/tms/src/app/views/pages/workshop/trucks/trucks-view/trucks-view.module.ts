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
import { trucksReducer } from '@tms/reducers';
import { TruckResolver } from '@tms/resolvers';
import { TrucksService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TrucksViewComponent } from './trucks-view.component';
import { TrucksViewEntryComponent } from './trucks-view.entry.component';
import { TrucksViewService } from './trucks-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: TrucksViewEntryComponent,
    resolve: {
      maintenance: TruckResolver
    }
  }
];

@NgModule({
  declarations: [TrucksViewComponent],
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
    StoreModule.forFeature('trucks', trucksReducer),
    EffectsModule.forFeature([BoxEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    TrucksService,
    TruckResolver,
    TrucksViewService,
  ],
})
export class TrucksViewModule { }
