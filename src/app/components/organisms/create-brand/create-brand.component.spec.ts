import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBrandComponent } from './create-brand.component';
import { of, throwError } from 'rxjs';
import { NotificationComponent } from 'src/app/components/atoms/notification/notification.component';
import { BrandService } from '@/core/services/brand.service';

class MockBrandService {
  createBrand = jest.fn().mockReturnValue(of({}));
}

describe('CreateBrandComponent', () => {
  let component: CreateBrandComponent;
  let fixture: ComponentFixture<CreateBrandComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateBrandComponent, NotificationComponent],
      providers: [{ provide: BrandService, useClass: MockBrandService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBrandComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with two controls', () => {
    component.ngOnInit();
    expect(component.brandForm.contains('name')).toBeTruthy();
    expect(component.brandForm.contains('description')).toBeTruthy();
  });

  it('should not submit the form when invalid', () => {
    component.ngOnInit();
    component.brandForm.controls['name'].setValue('');
    component.brandForm.controls['description'].setValue('');
    component.onSubmit();
    expect(brandService.createBrand).not.toHaveBeenCalled();
  });

  it('should submit the form when valid and show success notification', () => {
    component.ngOnInit();
    component.brandForm.controls['name'].setValue('Test brand');
    component.brandForm.controls['description'].setValue('Test Description');

    component.onSubmit();

    expect(brandService.createBrand).toHaveBeenCalled();
    expect(component.notificationMessage).toBe('Marca creada exitosamente');
    expect(component.notificationType).toBe('success');
    expect(component.showNotification).toBeTruthy();
  });
  
  it('should show error notification when submission fails', () => {
    brandService.createBrand = jest.fn().mockReturnValue(throwError(() => ({
      error: { message: 'Error creating brand' }
    })));
  
    component.ngOnInit();
    component.brandForm.controls['name'].setValue('Test brand');
    component.brandForm.controls['description'].setValue('Test Description');
  
    component.onSubmit();
  
    expect(component.notificationMessage).toBe('Error creating brand');
    expect(component.notificationType).toBe('error');
    expect(component.showNotification).toBeTruthy();
  });

  it('should hide notification after 3 seconds', (done) => {
    component.ngOnInit();
    component.brandForm.controls['name'].setValue('Test brand');
    component.brandForm.controls['description'].setValue('Test Description');
    
    component.onSubmit();
    expect(component.showNotification).toBeTruthy();

    setTimeout(() => {
      expect(component.showNotification).toBeFalsy();
      done();
    }, 3000);
  });
});
