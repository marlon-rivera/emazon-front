import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormFieldComponent } from './form-field.component';
import { InputFieldComponent } from 'src/app/components/atoms/input-field/input-field.component';
import { LabelComponent } from 'src/app/components/atoms/label/label.component';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFieldComponent, InputFieldComponent, LabelComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit inputValueChange when the input value changes', () => {
    jest.spyOn(component.inputValueChange, 'emit');
    component.inputValue = 'Initial Value';
    fixture.detectChanges();
    const inputField = fixture.debugElement.query(By.css('app-input-field'));
    inputField.triggerEventHandler('valueChange', 'New Value');
    expect(component.inputValueChange.emit).toHaveBeenCalledWith('New Value');
    expect(component.inputValue).toBe('New Value');
  });

  it('should emit touchedChange when input loses focus', () => {
    const emitSpy = jest.spyOn(component.touchedChange, 'emit');
    fixture.detectChanges();
    const inputField = fixture.debugElement.query(By.css('app-input-field'));
    inputField.triggerEventHandler('blur', null);
    expect(emitSpy).toHaveBeenCalled();
  });
});
