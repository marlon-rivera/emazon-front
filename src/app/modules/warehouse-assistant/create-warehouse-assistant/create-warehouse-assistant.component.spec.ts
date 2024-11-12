import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWarehouseAssistantComponent } from './create-warehouse-assistant.component';
import { UiModule } from '@/app/ui/ui.module';
import { UserModule } from '../../user/user.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateWarehouseAssistantComponent', () => {
  let component: CreateWarehouseAssistantComponent;
  let fixture: ComponentFixture<CreateWarehouseAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWarehouseAssistantComponent ],
      imports:[UserModule, HttpClientTestingModule]
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
