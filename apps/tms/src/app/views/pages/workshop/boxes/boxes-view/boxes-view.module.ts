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
import { BoxEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { boxesReducer } from '@tms/reducers';
import { BoxResolver } from '@tms/resolvers';
import { BoxesService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { BoxesViewComponent } from './boxes-view.component';
import { BoxesViewEntryComponent } from './boxes-view.entry.component';
import { BoxesViewService } from './boxes-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: BoxesViewEntryComponent,
    resolve: {
      box: BoxResolver
    }
  }
];

@NgModule({
  declarations: [BoxesViewComponent, BoxesViewEntryComponent],
  imports: [
    CommonModule,
    PartialsModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    RouterModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('boxes', boxesReducer),
    EffectsModule.forFeature([BoxEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    BoxesService,
    BoxResolver,
    BoxesViewService,
  ],
})
export class BoxesViewModule { }
