import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_URL_USER } from '../utils/api.constants';
import { InfoToken } from '../interfaces/auth.interface';
import * as jwt from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageSpy: jest.SpyInstance;

  const mockToken = 'mock.jwt.token';
  const mockValidDecodedToken: InfoToken = {
    role: 'USER',
    name: 'Test User',
    email: 'test@example.com',
    sub: 'user123',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor((Date.now() + 3600000) / 1000)
  };
  
  const mockExpiredDecodedToken: InfoToken = {
    role: 'USER',
    name: 'Test User',
    email: 'test@example.com',
    sub: 'user123',
    iat: Math.floor((Date.now() - 7200000) / 1000),
    exp: Math.floor((Date.now() - 3600000) / 1000)
  };
  
  const mockLoginRequest = {
    email: 'test@example.com',
    password: 'password123'
  };
  
  const mockLoginResponse = {
    token: mockToken
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorageSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    jest.spyOn(window.localStorage.__proto__, 'removeItem');
    
    jest.mock('jwt-decode', () => ({
      jwtDecode: jest.fn()
    }));
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initializeAuthState', () => {
    it('should initialize auth state with valid token', () => {
      localStorage.setItem('authToken', mockToken);
      jest.spyOn(jwt, 'jwtDecode').mockReturnValue(mockValidDecodedToken);
      
      service.initializeAuthState();

      expect(service.isAuthenticated).toBeTruthy();
      expect(service.infoToken).toEqual(mockValidDecodedToken);
      expect(service.loggedIn.value).toBeTruthy();
    });

    it('should logout if token is expired', () => {
      localStorage.setItem('authToken', mockToken);
      jest.spyOn(jwt, 'jwtDecode').mockReturnValue(mockExpiredDecodedToken);
      
      service.initializeAuthState();

      expect(service.isAuthenticated).toBeFalsy();
      expect(service.infoToken).toBeNull();
      expect(service.loggedIn.value).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should successfully login and set auth state', () => {
      jest.spyOn(jwt, 'jwtDecode').mockReturnValue(mockValidDecodedToken);

      service.login(mockLoginRequest).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
        expect(service.isAuthenticated).toBeTruthy();
        expect(service.infoToken).toEqual(mockValidDecodedToken);
        expect(service.loggedIn.value).toBeTruthy();
        expect(localStorage.getItem('authToken')).toBe(mockToken);
        expect(service.tokenExpirationTime).toBe(mockValidDecodedToken.exp * 1000);
      });

      const req = httpMock.expectOne(`${API_URL_USER}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });

    it('should handle login error and logout', () => {
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(service.isAuthenticated).toBeFalsy();
          expect(service.infoToken).toBeNull();
          expect(service.loggedIn.value).toBeFalsy();
          expect(localStorage.getItem('authToken')).toBeNull();
          expect(service.tokenExpirationTime).toBeNull();
        }
      });

      const req = httpMock.expectOne(`${API_URL_USER}/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid token', () => {
      jest.spyOn(jwt, 'jwtDecode').mockReturnValue(mockValidDecodedToken);

      const result = service.isTokenValid(mockToken);

      expect(result).toBeTruthy();
    });

    it('should return false for expired token', () => {
      jest.spyOn(jwt, 'jwtDecode').mockReturnValue(mockExpiredDecodedToken);

      const result = service.isTokenValid(mockToken);

      expect(result).toBeFalsy();
    });
  });

  describe('logout', () => {
    it('should clear auth state and localStorage', () => {
      localStorage.setItem('authToken', mockToken);
      service.isAuthenticated = true;
      service.infoToken = mockValidDecodedToken;
      service.loggedIn.next(true);
      service.tokenExpirationTime = mockValidDecodedToken.exp * 1000;

      service.logout();

      expect(service.isAuthenticated).toBeFalsy();
      expect(service.infoToken).toBeNull();
      expect(service.loggedIn.value).toBeFalsy();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(service.tokenExpirationTime).toBeNull();
    });
  });

  describe('token management', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('authToken', mockToken);

      const result = service.getToken();

      expect(result).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      const result = service.getToken();

       expect(result).toBeNull();
    });
  });
});