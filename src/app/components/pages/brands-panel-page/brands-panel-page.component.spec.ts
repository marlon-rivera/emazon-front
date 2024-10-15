import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsPanelPageComponent } from './brands-panel-page.component';

describe('BrandsPanelPageComponent', () => {
  let component: BrandsPanelPageComponent;
  let fixture: ComponentFixture<BrandsPanelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsPanelPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
