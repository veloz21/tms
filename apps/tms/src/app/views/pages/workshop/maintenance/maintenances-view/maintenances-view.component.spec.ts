import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancesViewComponent } from './maintenances-view.component';

describe('MaintenancesViewComponent', () => {
  let component: MaintenancesViewComponent;
  let fixture: ComponentFixture<MaintenancesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
