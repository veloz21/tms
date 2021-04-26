import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiresSharedEditComponent } from './tires-shared-edit.component';

describe('TiresSharedEditComponent', () => {
  let component: TiresSharedEditComponent;
  let fixture: ComponentFixture<TiresSharedEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiresSharedEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiresSharedEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
