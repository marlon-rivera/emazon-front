import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, expand, reduce } from 'rxjs/operators';
import { CategoryCreate, Category } from '@/app/shared/interfaces/category.interface';
import { PaginationInfoResponse, PaginationInfo } from '@/app/shared/interfaces/pagination-info.interface';
import { API_URL_CATEGORY } from '@/app/shared/utils/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(readonly http: HttpClient) { }

  createCategory(request: CategoryCreate): Observable<void> {
    return this.http.post<void>(`${API_URL_CATEGORY}/`, request);
  }

  getCategories(page: number, size: number, order: string): Observable<PaginationInfoResponse<Category>> {
    return this.http.get<PaginationInfoResponse<Category>>(`${API_URL_CATEGORY}/all?page=${page}&size=${size}&order=${order}`).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        const emptyResponse: PaginationInfoResponse<Category> = {
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

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL_CATEGORY}/allCategories`).pipe(
      catchError((error) => {
        return of([]);
      })
    );
  }
}

