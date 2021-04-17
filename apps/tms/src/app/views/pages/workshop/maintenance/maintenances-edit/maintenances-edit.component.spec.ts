import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesEditComponent } from './maintenances-edit.component';

describe('MaintenancesEditComponent', () => {
  let component: MaintenancesEditComponent;
  let fixture: ComponentFixture<MaintenancesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
