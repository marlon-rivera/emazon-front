import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoggedInGuard } from './logged-in.guard';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

jest.mock('@angular/router');
jest.mock('../../services/auth.service');

describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  beforeEach(() => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false);
    
    authService = {
      isLoggedIn: isLoggedInSubject,
    } as unknown as jest.Mocked<AuthService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        LoggedInGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(LoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is not logged in', (done) => {
    isLoggedInSubject.next(false);

    guard.canActivate({} as any, {} as any).subscribe(canActivate => {
      expect(canActivate).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to home and deny access when user is logged in', (done) => {
    isLoggedInSubject.next(true);

    guard.canActivate({} as any, {} as any).subscribe(canActivate => {
      expect(canActivate).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});