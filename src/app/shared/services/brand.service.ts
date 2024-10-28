import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaginationInfoResponse } from '@/app/shared/interfaces/pagination-info.interface';
import { API_URL_BRAND } from '@/app/shared/utils/api.constants';
import { BrandCreate, Brand } from '@/app/shared/interfaces/brandinterface';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(readonly http: HttpClient) { }

  createBrand(request: BrandCreate): Observable<void> {
    return this.http.post<void>(`${API_URL_BRAND}/`, request);
  }

  getBrands(page: number, size: number, order: string): Observable<PaginationInfoResponse<Brand>> {
    return this.http.get<PaginationInfoResponse<Brand>>(`${API_URL_BRAND}/all?page=${page}&size=${size}&order=${order}`).pipe(
      catchError((error) => {
        const emptyResponse: PaginationInfoResponse<Brand> = {
          paginationInfo: {
            list: [],
            currentPage: 0,
            pageSize: size,
            totalElements: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        };
        return of(emptyResponse);
      })
    );
  }

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${API_URL_BRAND}/allBrands`).pipe(
      catchError((error) => {
        return of([]);
      })
    );
  }
}
