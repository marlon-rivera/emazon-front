import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockAuthService {
  isLoggedIn = of(false);
  checkAuthentication = jest.fn().mockReturnValue(false);
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial logo dimensions on init', () => {
    component.ngOnInit();
    expect(component.sizeHeightLogo).toBeDefined();
    expect(component.sizeWidthtLogo).toBeDefined();
  });

  it('should update logo size on window resize', () => {
    component.onResize();
    expect(component.sizeHeightLogo).toBeGreaterThan(0);
    expect(component.sizeWidthtLogo).toBeGreaterThan(0);
  });

  it('should set isMobile to true when window width is less than SIZE_PHONE', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    component.onResize();
    expect(component.isMobile).toBeTruthy();
  });

  it('should set isMobile to false when window width is greater than or equal to SIZE_PHONE', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    component.onResize();
    expect(component.isMobile).toBeFalsy();
  });

  it('should subscribe to isLoggedIn observable from authService', () => {
    component.ngOnInit();
    expect(authService.isLoggedIn).toBeDefined();
  });

  it('should set isLogged based on authentication check', () => {
    authService.checkAuthentication = jest.fn().mockReturnValue(true);
    component.ngOnInit();
    expect(component.isLogged).toBeTruthy();
  });

  it('should render the login link correctly', () => {
    fixture.detectChanges();
    const loginLink = fixture.debugElement.query(By.css('.header__login__login'));
    expect(loginLink.nativeElement.textContent.trim()).toContain('Ingresar');
  });

  it('should render the logo component', () => {
    fixture.detectChanges();
    const logoElement = fixture.debugElement.query(By.css('app-logo'));
    expect(logoElement).toBeTruthy();
  });
});
