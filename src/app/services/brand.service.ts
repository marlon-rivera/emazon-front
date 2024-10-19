import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationInfoResponse } from 'src/app/interfaces/pagination-info.interface';
import { API_URL_BRAND } from 'src/app/utils/api.constants';
import { BrandCreate, Brand } from 'src/app/interfaces/brandinterface';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(readonly http: HttpClient) { }

  createBrand(request : BrandCreate): Observable<void>{
    return this.http.post<void>(`${API_URL_BRAND}/`, request);
  }

  getBrands(page: number, size: number, order: string): Observable<PaginationInfoResponse<Brand>> {
    return this.http.get<PaginationInfoResponse<Brand>>(`${API_URL_BRAND}/all?page=${page}&size=${size}&order=${order}`);
  }
}
