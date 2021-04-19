import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksViewComponent } from './trucks-view.component';

describe('TrucksViewComponent', () => {
  let component: TrucksViewComponent;
  let fixture: ComponentFixture<TrucksViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucksViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
