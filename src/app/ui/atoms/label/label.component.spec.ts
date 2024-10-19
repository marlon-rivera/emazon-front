import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LabelComponent } from './label.component';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(LabelComponent);
    component = fixture.componentInstance; 
    component.for = 'test-input';
    component.labelText = 'Test Label';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label with correct text and for attribute', () => {
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(labelElement.textContent).toBe('Test Label');
    expect(labelElement.getAttribute('for')).toBe('test-input');
  });
});
