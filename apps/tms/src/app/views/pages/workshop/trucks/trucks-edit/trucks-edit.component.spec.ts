import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucksEditComponent } from './trucks-edit.component';

describe('TrucksEditComponent', () => {
  let component: TrucksEditComponent;
  let fixture: ComponentFixture<TrucksEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrucksEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrucksEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
