import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '@/app/shared/services/auth.service';
import { BEARER, HEADER_AUTHORIZATION } from '@/app/shared/utils/api.constants';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(readonly authService : AuthService, readonly router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    let clonedReq = request;
    if(token){
       clonedReq = request.clone({
        headers: request.headers.set(HEADER_AUTHORIZATION, `${BEARER} ${token}`)
      })
    }
    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { 
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
