import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { BEARER, HEADER_AUTHORIZATION } from 'src/app/shared/utils/api.constants';

describe('TokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let httpClient: HttpClient;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    const authServiceMock = {
      getToken: jest.fn(),
      logout: jest.fn()
    };
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorization header if token is present', () => {
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

  it('should not add authorization header if token is not present', () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);

    httpClient.get('/test-endpoint').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has(HEADER_AUTHORIZATION)).toBeFalsy();
    req.flush({});
  });

  it('should call logout and redirect to /login if response is a 401 error', () => {
    (authService.getToken as jest.Mock).mockReturnValue('fake-token');

    httpClient.get('/test-endpoint').subscribe({
      next: () => fail('Request should have failed with 401 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/test-endpoint');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(authService.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});