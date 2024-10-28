import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWarehouseAssistantComponent } from './create-warehouse-assistant.component';

describe('CreateWarehouseAssistantComponent', () => {
  let component: CreateWarehouseAssistantComponent;
  let fixture: ComponentFixture<CreateWarehouseAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWarehouseAssistantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateWarehouseAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
