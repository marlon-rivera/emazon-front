import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '@/app/shared/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import {
  SIZE_PHONE,
  SIZE_HEIGHT_LOGO_DESKTOP_HEADER,
  SIZE_HEIGHT_LOGO_PHONE_HEADER,
  SIZE_WIDTH_LOGO_DESKTOP_HEADER,
  SIZE_WIDTH_LOGO_PHONE_HEADER,
  EMPTY
} from '@/app/shared/utils/api.constants';
import { OrganismsModule } from '../organisms.module';
import { UiModule } from '../../ui.module';
import { RouterModule } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jest.Mocked<AuthService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    
    const authServiceMock = {
      isLoggedIn: isLoggedInSubject.asObservable(),
      checkAuthentication: jest.fn().mockReturnValue(false)
    };

    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call onResize', () => {
      const onResizeSpy = jest.spyOn(component, 'onResize');
      fixture.detectChanges();
      expect(onResizeSpy).toHaveBeenCalled();
    });

    it('should subscribe to authService.isLoggedIn', () => {
      fixture.detectChanges();
      isLoggedInSubject.next(true);
      expect(component.isLogged).toBe(true);
    });

    it('should check initial authentication status', () => {
      authService.checkAuthentication.mockReturnValueOnce(true);
      fixture.detectChanges();
      expect(component.isLogged).toBe(true);
      expect(authService.checkAuthentication).toHaveBeenCalled();
    });

    it('should initialize productSearched with EMPTY', () => {
      fixture.detectChanges();
      expect(component.productSearched).toBe(EMPTY);
    });
  });

  describe('onResize', () => {
    describe('mobile view', () => {
      beforeEach(() => {
        global.innerWidth = SIZE_PHONE - 1;
      });

      it('should set mobile configuration when screen width is less than SIZE_PHONE', () => {
        component.onResize();
        expect(component.isMobile).toBe(true);
        expect(component.sizeHeightLogo).toBe(SIZE_HEIGHT_LOGO_PHONE_HEADER);
        expect(component.sizeWidthtLogo).toBe(SIZE_WIDTH_LOGO_PHONE_HEADER);
      });
    });

    describe('desktop view', () => {
      beforeEach(() => {
        global.innerWidth = SIZE_PHONE + 1;
      });

      it('should set desktop configuration when screen width is greater than SIZE_PHONE', () => {
        component.onResize();
        expect(component.isMobile).toBe(false);
        expect(component.sizeHeightLogo).toBe(SIZE_HEIGHT_LOGO_DESKTOP_HEADER);
        expect(component.sizeWidthtLogo).toBe(SIZE_WIDTH_LOGO_DESKTOP_HEADER);
      });
    });

    it('should respond to window resize event', () => {
      const onResizeSpy = jest.spyOn(component, 'onResize');
      
      window.dispatchEvent(new Event('resize'));
      
      expect(onResizeSpy).toHaveBeenCalled();
    });
  });

  describe('authentication changes', () => {
    it('should update isLogged when auth status changes', () => {
      fixture.detectChanges();
      expect(component.isLogged).toBe(false);
      
      isLoggedInSubject.next(true);
      expect(component.isLogged).toBe(true);
      
      isLoggedInSubject.next(false);
      expect(component.isLogged).toBe(false);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});