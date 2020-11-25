import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxModel } from '@models';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';

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

describe('LoginComponent', () => {

  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When the component is initialized', () => {
    it('should create form', () => {
      expect(Object.keys(component.loginForm.controls)).toEqual([
        'email',
        'password',
      ]);
    });
  });
});
