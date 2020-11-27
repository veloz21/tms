import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@bits404/api-interfaces';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@tms/reducers';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService, AuthNoticeService, Login } from '../../../../core/auth';

@Component({
  selector: 'b404-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];

  private unsubscribe: Subject<any>;

  private returnUrl: any;
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.initLoginForm();

    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/';
    });
  }

  ngOnDestroy(): void {
    this.authNoticeService.setNotice(null);
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initLoginForm() {

    this.loginForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
      ])
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ]
    });
  }

  submit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const user = this.prepareUser();

    this.auth.login(user).subscribe(() => {
      this.store.dispatch(new Login({ Success: 'Yes' }));
      console.log(user);
      this.router.navigateByUrl(this.returnUrl);
      this.loading = false;
      this.cdr.markForCheck();
    }, error => {
      this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  prepareUser(): Partial<IUser> {
    return {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    }
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
