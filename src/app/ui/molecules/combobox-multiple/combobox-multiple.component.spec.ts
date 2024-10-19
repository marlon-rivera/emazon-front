import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxMultipleComponent } from './combobox-multiple.component';

describe('ComboboxComponent', () => {
  let component: ComboboxMultipleComponent;
  let fixture: ComponentFixture<ComboboxMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComboboxMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboboxMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
