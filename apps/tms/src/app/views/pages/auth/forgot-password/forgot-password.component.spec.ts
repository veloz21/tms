import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '@layout';
import { BoxModel } from '@models/box.model';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';

class RouterStub {
  url;
  navigateByUrl() { }
}
class StoreStub {
  select() {
    return of(true);
  }
  dispatch(value) { }
}

class ActivatedRouteStub {
  snapshot = {
    data: {
      box: new BoxModel({})
    }
  };
  data = of({ box: new BoxModel({}) });
}

class SubheaderServiceStub {
  setTitle() { }
  setBreadcrumbs(value) { }
}

describe('ForgotPasswordComponent', () => {

  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: Store, useClass: StoreStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When the component is initialized', () => {
    it('should create form', () => {
      expect(Object.keys(component.forgotPasswordForm.controls)).toEqual([
        'email',
      ]);
    });
  });
});
