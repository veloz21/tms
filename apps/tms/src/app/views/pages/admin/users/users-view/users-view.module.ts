import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LayoutUtilsService } from '@tms/crud';
import { UserEffects } from '@tms/effects';
import { environment } from '@tms/environments/environment';
import { FakeApiService } from '@tms/layout';
import { PartialsModule } from '@tms/partials/partials.module';
import { usersReducer } from '@tms/reducers';
import { UserResolver } from '@tms/resolvers';
import { UsersService } from '@tms/services';
import { SharedModule } from '@tms/shared/shared.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { UsersViewComponent } from './users-view.component';
import { UsersViewEntryComponent } from './users-view.entry.component';
import { UsersViewService } from './users-view.service';

const routes: Route[] = [
  {
    path: ':id',
    component: UsersViewEntryComponent,
    resolve: {
      maintenance: UserResolver
    }
  }
];

@NgModule({
  declarations: [UsersViewComponent],
  imports: [
    CommonModule,
    PartialsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
      passThruUnknownUrl: true,
      dataEncapsulation: false
    }) : [],
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
    SharedModule,
  ],
  providers: [
    LayoutUtilsService,
    UsersService,
    UserResolver,
    UsersViewService,
  ],
})
export class UsersViewModule { }
