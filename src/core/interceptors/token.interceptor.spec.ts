import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { BEARER, HEADER_AUTHORIZATION } from '../constants/api.constants';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let httpClient: HttpClient;

  beforeEach(() => {
    const authServiceMock = {
      getToken: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an authorization header if a token is present', () => {
    const mockToken = 'fake-token';
    (authService.getToken as jest.Mock).mockReturnValue(mockToken);

    httpClient.get('/test-endpoint').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has(HEADER_AUTHORIZATION)).toBeTruthy();
    expect(req.request.headers.get(HEADER_AUTHORIZATION)).toBe(`${BEARER} ${mockToken}`);
    req.flush({});
  });

  it('should not add an authorization header if no token is present', () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);

    httpClient.get('/test-endpoint').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has(HEADER_AUTHORIZATION)).toBeFalsy();
    req.flush({});
  });
});
