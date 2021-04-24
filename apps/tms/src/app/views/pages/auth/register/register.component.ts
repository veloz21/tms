import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICompany, IUser } from '@bits404/api-interfaces';
import { ConfirmPasswordValidator } from '@tms/crud';
import { CustomTranslateService } from '@tms/translate';
import { Subject } from 'rxjs';
import { AuthenticationService, AuthNoticeService } from '../../../../core/auth/';

@Component({
  selector: 'b404-register',
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  loading = false;
  errors: any = [];

  get userForm() {
    return this.registerForm.get('user') as FormGroup;
  }

  get companyForm() {
    return this.registerForm.get('company') as FormGroup;
  }

  private unsubscribe: Subject<any>;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private auth: AuthenticationService,
    private translate: CustomTranslateService,
    private authNoticeService: AuthNoticeService,
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit() {
    this.initRegisterForm();
    console.log('userForm', this.userForm);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initRegisterForm() {
    this.registerForm = this.fb.group({
      company: this.fb.group({
        name: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])],
      }),
      user: this.fb.group({
        email: ['', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          Validators.maxLength(320)
        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])],
        confirmPassword: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])],
        agree: [false, Validators.compose([Validators.required])]
      }, {
        validator: ConfirmPasswordValidator.MatchPassword
      })
    });
  }

  submit() {
    const controls = this.registerForm.controls;

    // check form
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (!this.userForm.get('agree').value) {
      // you must agree the terms and condition
      // checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
      this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
      return;
    }

    this.loading = true;

    const company = this.prepareCompany();
    const user = this.prepareUser();

    this.auth.register(company, user).subscribe(() => {
      this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
      this.router.navigateByUrl('/auth/login');
      this.loading = false;
      this.cdr.markForCheck();
    }, error => {
      this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  prepareCompany(): ICompany {
    return {
      name: this.companyForm.get('name').value,
    };
  }

  prepareUser(): Partial<IUser> {
    return {
      email: this.userForm.get('email').value,
      password: this.userForm.get('password').value,
    }
  }

  isControlHasError(formGroup: FormGroup, controlName: string, validationType: string): boolean {
    const control = formGroup.get(controlName);
    if (!control) {
      return false;
    }

    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }
}
