import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanelPageComponent } from './control-panel-page.component';

describe('ControlPanelPageComponent', () => {
  let component: ControlPanelPageComponent;
  let fixture: ComponentFixture<ControlPanelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlPanelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
