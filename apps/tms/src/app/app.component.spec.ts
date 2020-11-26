import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutConfigService, SplashScreenService, TranslationService } from '@tms/layout';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

class RouterStub {
  events = of({
    urlAfterRedirects: null,
    id: null,
    url: null,
  });
}

class TranslationServiceStub {
  loadTranslations() { }
}

class LayoutConfigServiceStub {
  getConfig(value) {
    return true;
  }
}

class SplashScreenServiceStub {
  hide() { }
}


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: TranslationService, useClass: TranslationServiceStub },
        { provide: LayoutConfigService, useClass: LayoutConfigServiceStub },
        { provide: SplashScreenService, useClass: SplashScreenServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AppComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have router outlet', () => {
    const de = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(de).not.toBeNull();
  });

  it('should load translations', () => {
    const translationService = de.injector.get(TranslationService);
    const loadTranslations = spyOn(translationService, 'loadTranslations');
    component.ngOnInit();
    expect(loadTranslations).toHaveBeenCalled();
  });
});
