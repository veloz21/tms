import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '@layout';
import { BoxModel } from '@models';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BoxesEditComponent } from './boxes-edit.component';

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

class RouterStub {
  url;
  navigateByUrl() { }
}

class SubheaderServiceStub {
  setTitle() { }
  setBreadcrumbs(value) { }
}

describe('BoxesEditComponent', () => {

  let fixture: ComponentFixture<BoxesEditComponent>;
  let component: BoxesEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxesEditComponent],
      providers: [
        { provide: Store, useClass: StoreStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        { provide: SubheaderService, useClass: SubheaderServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('When the component is initialized', () => {
    it('should set box', () => {
      expect(component.box).toBeTruthy();
      expect(component.oldBox).toBeTruthy();
    });
    it('should create form', () => {
      expect(Object.keys(component.boxForm.controls)).toEqual([
        'model',
        'type',
        'km',
        'serialNumber',
        'brand',
      ]);
    });
  });

  // describe('When refresh is executed', () => {
  //   it('should set box with oldBox', () => {
  //     component.box.brand = 'something else';
  //     console.log(component.box);
  //     console.log(component.oldBox);
  //     component.refreshBox();
  //     console.log(component.box);
  //     console.log(component.oldBox);
  //     expect(component.box).toEqual(component.oldBox);
  //   });
  //   it('should clear form', () => {
  //     component.boxForm.markAsDirty();
  //     component.boxForm.markAllAsTouched();
  //     component.refreshBox();
  //     expect(component.boxForm.touched).toBe(false);
  //     expect(component.boxForm.dirty).toBe(false);
  //   });
  // });
});
