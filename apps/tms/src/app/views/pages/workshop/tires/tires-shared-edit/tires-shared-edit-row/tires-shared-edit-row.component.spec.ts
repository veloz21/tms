import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiresSharedEditRowComponent } from './tires-shared-edit-row.component';

describe('TiresSharedEditRowComponent', () => {
  let component: TiresSharedEditRowComponent;
  let fixture: ComponentFixture<TiresSharedEditRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiresSharedEditRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiresSharedEditRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
