import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRoutingEntryComponent } from './dialog-routing-entry.component';

describe('DialogRoutingEntryComponent', () => {
  let component: DialogRoutingEntryComponent;
  let fixture: ComponentFixture<DialogRoutingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRoutingEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRoutingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
