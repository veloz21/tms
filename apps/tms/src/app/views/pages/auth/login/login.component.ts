import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '@bits404/api-interfaces';
import { Store } from '@ngrx/store';
import { AppState } from '@tms/reducers';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthNoticeService, Login } from '../../../../core/auth';

@Component({
  selector: 'b404-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];

  private returnUrl: any;
  private unsubscribe: Subject<any>;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private authNoticeService: AuthNoticeService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.initLoginForm();
    this.setDevCredentials();

    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params.returnUrl || '/';
    });
  }

  setDevCredentials() {
    if (!environment.production) {
      this.loginForm.get('email').setValue('fernando.veloz@bits404.com');
      this.loginForm.get('password').setValue('demo');
    }
  }

  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const user = this.prepareUser();

    this.store.dispatch(new Login({ user }));
    // this.store.pipe(select());

    // this.auth.login(user).subscribe(
    //   () => {
    //     console.log(user);
    //     this.router.navigateByUrl(this.returnUrl);
    //     this.loading = false;
    //     this.cdr.markForCheck();
    //   },
    //   (error) => {
    //     this.authNoticeService.setNotice(
    //       this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'),
    //       'danger'
    //     );
    //     this.loading = false;
    //     this.cdr.markForCheck();
    //   }
    // );
  }

  prepareUser(): Partial<IUser> {
    return {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
