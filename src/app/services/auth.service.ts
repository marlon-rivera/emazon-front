import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenKey: string = 'authToken';
  loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();
  isAuthenticated = false;

  checkAuthentication(): boolean {
    this.loggedIn.next(this.isAuthenticated);
    return this.isAuthenticated;
  }

  login() {
    this.isAuthenticated = true;
    this.loggedIn.next(this.isAuthenticated);
  }

  logout() {
    this.loggedIn.next(this.isAuthenticated);
  }
  getToken(): string | null{
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void{
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void{
    localStorage.removeItem(this.tokenKey);
  }

}
