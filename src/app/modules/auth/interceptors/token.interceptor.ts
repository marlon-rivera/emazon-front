import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BEARER, HEADER_AUTHORIZATION } from 'src/app/utils/api.constants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(readonly authService : AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    if(token){
      const clonedReq = request.clone({
        headers: request.headers.set(HEADER_AUTHORIZATION, `${BEARER} ${token}`)
      })
      return next.handle(clonedReq)
    }
    return next.handle(request);
  }
}
