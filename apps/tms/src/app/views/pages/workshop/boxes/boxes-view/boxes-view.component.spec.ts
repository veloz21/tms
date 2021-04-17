import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesViewComponent } from './boxes-view.component';

describe('BoxesViewComponent', () => {
  let component: BoxesViewComponent;
  let fixture: ComponentFixture<BoxesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
