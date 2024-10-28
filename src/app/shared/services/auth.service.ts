import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Auth, InfoToken, LoginRequest } from "../interfaces/auth.interface";
import { HttpClient } from "@angular/common/http";
import { API_URL_USER } from "../utils/api.constants";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly tokenKey: string = "authToken";
  readonly loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();
  isAuthenticated = false;
  infoToken: InfoToken | null = null;
  tokenExpirationTime: number | null = null;

  constructor(private readonly http: HttpClient) {
    this.initializeAuthState();
  }

  initializeAuthState(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      this.setData(token);
    } else {
      this.logout();
    }
  }

  login(login: LoginRequest): Observable<Auth> {
    return this.http.post<Auth>(`${API_URL_USER}/login`, login).pipe(
      tap((response: Auth) => {
        this.setData(response.token);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isTokenValid(token: string): boolean {
    const decodedToken: InfoToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() < expirationTime;
  }

  private setData(token: string): void {
    this.infoToken = jwtDecode(token) as InfoToken;
    this.setToken(token);
    this.isAuthenticated = true;
    this.loggedIn.next(true);
    this.setTokenExpirationTime();
  }

  private setTokenExpirationTime(): void {
    this.tokenExpirationTime = this.infoToken!.exp * 1000;
  }
  
  logout(): void {
    this.removeToken();
    this.infoToken = null;
    this.tokenExpirationTime = null;
    this.isAuthenticated = false;
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}