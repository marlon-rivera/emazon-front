import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '@/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: of(false),
      infoToken: { name: '' },
      logout: jest.fn()
    } as unknown as jest.Mocked<AuthService>;
    
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authentication state and username on init', () => {
    authServiceMock.isLoggedIn = of(true);
    authServiceMock.infoToken!.name = 'John Doe';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLogged).toBe(true);
    expect(component.username).toBe('John Doe');
  });

  it('should set isLogged to false and username to empty if user is not authenticated', () => {
    authServiceMock.isLoggedIn = of(false);
    authServiceMock.infoToken!.name = '';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLogged).toBe(false);
    expect(component.username).toBe('');
  });

  it('should call logout and redirect to home page when logging out', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});