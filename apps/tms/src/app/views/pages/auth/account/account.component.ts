import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'b404-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit, OnDestroy {
  // Public params
  loginForm: FormGroup;
  loading = false;
  errors: any = [];
  private unsubscribe: Subject<any>;
  private returnUrl: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.unsubscribe = new Subject();
  }

  ngOnInit(): void {
    this.initLoginForm();

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl || '/';
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.loading = false;
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      company: ['galmex', Validators.required]
    });
  }

  submit() {
    const controls = this.loginForm.controls;
    /** check form */
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.router.navigate(['/auth/login']);
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
