import { NgModule } from '@angular/core';
import { AuthenticationService } from '@tms/core/auth/_services';
import { AuthModule, AUTH_SERVICE, PROTECTED_FALLBACK_PAGE_URI, PUBLIC_FALLBACK_PAGE_URI } from 'ngx-auth';
@NgModule({
  imports: [AuthModule],
  providers: [
    { provide: PROTECTED_FALLBACK_PAGE_URI, useValue: '/auth/account' },
    { provide: PUBLIC_FALLBACK_PAGE_URI, useValue: '/auth/account' },
    { provide: AUTH_SERVICE, useClass: AuthenticationService }
  ]
})
export class AuthenticationModule { }
