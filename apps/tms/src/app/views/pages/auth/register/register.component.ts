import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '@reducers';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { AuthenticationService, AuthNoticeService } from '../../../../core/auth/';
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: 'b404-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  errors: any = [];

  private unsubscribe: Subject<any>;
  constructor(
    private authNoticeService: AuthNoticeService,
    private translate: TranslateService,
    private router: Router,
    private auth: AuthenticationService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initRegisterForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initRegisterForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email,
        Validators.minLength(3),
        // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        Validators.maxLength(320)
      ]),
      ],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      ],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
      ],
      agree: [false, Validators.compose([Validators.required])]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  submit() {
    const controls = this.registerForm.controls;

    // check form
    if (this.registerForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }

    this.loading = true;

    if (!controls.agree.value) {
      // you must agree the terms and condition
      // checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
      this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
      return;
    }

    const _company = {
      name: controls.username.value,
      email: controls.email.value,
      password: controls.password.value
    };
    this.auth.register(_company.name, _company.email, _company.password ).pipe(
      tap(company => {
        if (company) {
          this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
          this.router.navigateByUrl('/auth/login');
        } else {
          this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
        }
      }),
      takeUntil(this.unsubscribe),
      finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      })
    ).subscribe();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.registerForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
