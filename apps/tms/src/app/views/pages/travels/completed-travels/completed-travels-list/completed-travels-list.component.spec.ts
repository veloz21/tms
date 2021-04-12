import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTravelsListComponent } from './completed-travels-list.component';

describe('CompletedTravelsListComponent', () => {
  let component: CompletedTravelsListComponent;
  let fixture: ComponentFixture<CompletedTravelsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedTravelsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTravelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
