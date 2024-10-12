import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the button component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the button text correctly', () => {
    component.buttonText = 'Click Me';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent.trim()).toBe('Click Me');
  });

  it('should disable the button when disabledButton is true', () => {
    component.disabledButton = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.disabled).toBeTruthy();
  });

  it('should enable the button when disabledButton is false', () => {
    component.disabledButton = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.disabled).toBeFalsy();
  });

  it('should emit the buttonClick event when clicked', () => {
    const emitSpy = jest.spyOn(component.buttonClick, 'emit');
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();
    expect(emitSpy).toHaveBeenCalled();
  });
  
});
