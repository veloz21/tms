import { NgModule } from '@angular/core';
import { AuthModule, AUTH_SERVICE, PROTECTED_FALLBACK_PAGE_URI, PUBLIC_FALLBACK_PAGE_URI } from 'ngx-auth';
import { AuthenticationService } from './_services/authentication.service';

@NgModule({
  imports: [AuthModule],
  providers: [
    { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/' },
    { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/auth/account' },
    { provide: AUTH_SERVICE, useClass: AuthenticationService }
  ]
})
export class AuthenticationModule { }
