import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputFieldComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;

    component.id = 'test-input';
    component.name = 'testName';
    component.value = 'Initial value';
    component.size = 50;
    component.required = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChange event on input change', () => {
    const emitSpy = jest.spyOn(component.valueChange, 'emit');
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'New value';
    inputElement.dispatchEvent(new Event('input'));
    expect(emitSpy).toHaveBeenCalledWith('New value');
  });

  it('should emit blur event on blur', () => {
    const emitSpy = jest.spyOn(component.blur, 'emit');
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.dispatchEvent(new Event('blur'));
    expect(emitSpy).toHaveBeenCalled();
  });
});
