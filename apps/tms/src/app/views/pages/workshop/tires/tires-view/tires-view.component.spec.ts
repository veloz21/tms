import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiresViewComponent } from './tires-view.component';

describe('TiresViewComponent', () => {
  let component: TiresViewComponent;
  let fixture: ComponentFixture<TiresViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiresViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiresViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
