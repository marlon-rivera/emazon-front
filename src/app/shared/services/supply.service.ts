import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddSuply } from '../interfaces/supply.interface';
import { Observable } from 'rxjs';
import { API_URL_SUPPLY } from '../utils/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {

  constructor(readonly http: HttpClient) { }

  addSupply(request: AddSuply): Observable<void> {
    return this.http.post<void>(`${API_URL_SUPPLY}/add`, request);
  }
}
