import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelsEditComponent } from './travels-edit.component';

describe('TravelsEditComponent', () => {
  let component: TravelsEditComponent;
  let fixture: ComponentFixture<TravelsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
