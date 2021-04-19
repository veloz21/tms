import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { TireEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { tiresReducer } from '@tms/reducers';
import { TireResolver } from '@tms/resolvers';
import { TiresService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TiresViewComponent } from './tires-view.component';
import { TiresViewEntryComponent } from './tires-view.entry.component';
import { TiresViewService } from './tires-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: TiresViewEntryComponent,
    resolve: {
      maintenance: TireResolver
    }
  }
];

@NgModule({
  declarations: [TiresViewComponent, TiresViewEntryComponent],
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
    StoreModule.forFeature('tires', tiresReducer),
    EffectsModule.forFeature([TireEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    TiresService,
    TireResolver,
    TiresViewService,
  ],
})
export class TiresViewModule { }
