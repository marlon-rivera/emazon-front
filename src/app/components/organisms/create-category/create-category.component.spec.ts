import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateCategoryComponent } from './create-category.component';
import { CategoryService } from 'src/core/services/category.service';
import { of, throwError } from 'rxjs';
import { NotificationComponent } from 'src/app/components/atoms/notification/notification.component';

class MockCategoryService {
  createCategory = jest.fn().mockReturnValue(of({}));
}

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CreateCategoryComponent, NotificationComponent],
      providers: [{ provide: CategoryService, useClass: MockCategoryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with two controls', () => {
    component.ngOnInit();
    expect(component.categoryForm.contains('name')).toBeTruthy();
    expect(component.categoryForm.contains('description')).toBeTruthy();
  });

  it('should not submit the form when invalid', () => {
    component.ngOnInit();
    component.categoryForm.controls['name'].setValue('');
    component.categoryForm.controls['description'].setValue('');
    component.onSubmit();
    expect(categoryService.createCategory).not.toHaveBeenCalled();
  });

  it('should submit the form when valid and show success notification', () => {
    component.ngOnInit();
    component.categoryForm.controls['name'].setValue('Test Category');
    component.categoryForm.controls['description'].setValue('Test Description');

    component.onSubmit();

    expect(categoryService.createCategory).toHaveBeenCalled();
    expect(component.notificationMessage).toBe('Categoría creada exitosamente');
    expect(component.notificationType).toBe('success');
    expect(component.showNotification).toBeTruthy();
  });
  
  it('should show error notification when submission fails', () => {
    categoryService.createCategory = jest.fn().mockReturnValue(throwError(() => ({
      error: { message: 'Error creating category' }
    })));
  
    component.ngOnInit();
    component.categoryForm.controls['name'].setValue('Test Category');
    component.categoryForm.controls['description'].setValue('Test Description');
  
    component.onSubmit();
  
    expect(component.notificationMessage).toBe('Error creating category');
    expect(component.notificationType).toBe('error');
    expect(component.showNotification).toBeTruthy();
  });

  it('should hide notification after 3 seconds', (done) => {
    component.ngOnInit();
    component.categoryForm.controls['name'].setValue('Test Category');
    component.categoryForm.controls['description'].setValue('Test Description');
    
    component.onSubmit();
    expect(component.showNotification).toBeTruthy();

    setTimeout(() => {
      expect(component.showNotification).toBeFalsy();
      done();
    }, 3000);
  });
});
