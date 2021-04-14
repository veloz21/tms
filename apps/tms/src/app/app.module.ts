import { OverlayModule } from '@angular/cdk/overlay';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import {
  DataTableService,
  FakeApiService,
  KtDialogService,
  LayoutConfigService,
  LayoutRefService,
  MenuAsideService,
  MenuConfigService,
  MenuHorizontalService,
  PageConfigService,
  SplashScreenService,
  SubheaderService
} from '@tms/layout';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgAisModule } from 'angular-instantsearch';
import { InlineSVGModule } from 'ng-inline-svg';
import {
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
import { NgxPermissionsModule } from 'ngx-permissions';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './core/auth/authentication.module';
import { CoreModule } from './core/core.module';
import { metaReducers, reducers } from './core/reducers';
import {
  HttpUtilsService,
  LayoutUtilsService,
  TypesUtilsService
} from './core/_base/crud';
import { MissingTranslationHelper } from './core/_base/layout/translate';
import { LayoutConfig } from './core/_config/layout.config';
import { AuthModule } from './views/pages/auth/auth.module';
import { PartialsModule } from './views/partials/partials.module';
import { ThemeModule } from './views/theme/theme.module';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelSpeed: 0.5,
  swipeEasing: true,
  minScrollbarLength: 40,
  maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
  // initialize app by loading default demo layout config
  return () => {
    if (appConfig.getConfig() === null) {
      appConfig.loadConfigs(new LayoutConfig().configs);
    }
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AuthenticationModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    EffectsModule.forRoot([]),
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeApiService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    InlineSVGModule.forRoot(),
    MatProgressSpinnerModule,
    NgxPermissionsModule.forRoot(),
    NgAisModule.forRoot(),
    OverlayModule,
    PartialsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument(),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
    }),
    ThemeModule,
  ],
  exports: [],
  providers: [
    LayoutConfigService,
    LayoutRefService,
    MenuConfigService,
    PageConfigService,
    KtDialogService,
    DataTableService,
    SplashScreenService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    // {
    //   provide: HAMMER_GESTURE_CONFIG,
    //   useClass: GestureConfig
    // },
    {
      // layout config initializer
      provide: APP_INITIALIZER,
      useFactory: initializeLayoutConfig,
      deps: [LayoutConfigService],
      multi: true,
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
    // template services
    SubheaderService,
    MenuHorizontalService,
    MenuAsideService,
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
