import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentYear to the current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should set date to the current date as a string', () => {
    const currentDate = new Date().toDateString();
    expect(component.date).toBe(currentDate);
  });

  it('should render the logo component', () => {
    fixture.detectChanges();
    const logoElement = fixture.debugElement.query(By.css('.footer__logo'));
    expect(logoElement).toBeTruthy();
  });

  it('should render the contact phone number', () => {
    fixture.detectChanges();
    const phoneElement = fixture.debugElement.query(By.css('.footer__info__phone'));
    expect(phoneElement.nativeElement.textContent.trim()).toBe('+57 350 731 0045');
  });

  it('should render the email address', () => {
    fixture.detectChanges();
    const emailElement = fixture.debugElement.query(By.css('.footer__info__email'));
    expect(emailElement.nativeElement.textContent.trim()).toBe('riveramarlon33@gmail.com');
  });

  it('should render the current year in copyright section', () => {
    fixture.detectChanges();
    const copyrightElement = fixture.debugElement.query(By.css('.footer__copy--info'));
    expect(copyrightElement.nativeElement.textContent).toContain(component.currentYear.toString());
  });
});
