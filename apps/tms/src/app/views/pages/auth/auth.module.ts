import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorDialogComponent } from '@tms/shared/dialogs/error-dialog/error-dialog.component';
import { ErrorDialogModule } from '@tms/shared/dialogs/error-dialog/error-dialog.module';
import { PublicGuard } from 'ngx-auth';
import { AuthEffects, AuthenticationService, AuthGuard, authReducer } from '../../../core/auth';
import { AccountComponent } from './account/account.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [PublicGuard],
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname }
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    TranslateModule.forChild(),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  providers: [
    // InterceptService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: InterceptService,
    //   multi: true
    // },
  ],
  entryComponents: [
    ErrorDialogComponent
  ],
  exports: [AuthComponent],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AuthNoticeComponent,
    AccountComponent
  ]
})

export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthenticationService,
        AuthGuard
      ]
    };
  }
}
