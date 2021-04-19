import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { TravelEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { travelsReducer } from '@tms/reducers';
import { TravelResolver } from '@tms/resolvers';
import { TravelsService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TravelsViewComponent } from './travels-view.component';
import { TravelsViewEntryComponent } from './travels-view.entry.component';
import { TravelsViewService } from './travels-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: TravelsViewEntryComponent,
    resolve: {
      travel: TravelResolver
    }
  }
];

@NgModule({
  declarations: [TravelsViewComponent, TravelsViewEntryComponent],
  imports: [
    CommonModule,
    PartialsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatTabsModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('travels', travelsReducer),
    EffectsModule.forFeature([TravelEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    TravelsService,
    TravelResolver,
    TravelsViewService,
  ],
})
export class TravelsViewModule { }
