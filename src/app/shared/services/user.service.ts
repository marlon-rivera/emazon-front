import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUser } from '../interfaces/user.interface';
import { API_URL_USER } from '../utils/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(readonly http: HttpClient) { }

  createWarehouseAssistant(request: CreateUser): Observable<void> {
    console.log(request)
    return this.http.post<void>(`${API_URL_USER}/registerWarehouse`, request);
  }

}
