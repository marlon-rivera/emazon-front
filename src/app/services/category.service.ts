import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryCreate, Category } from 'src/app/interfaces/category.interface';
import { PaginationInfoResponse } from 'src/app/interfaces/pagination-info.interface';
import { API_URL_CATEGORY } from 'src/app/utils/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(readonly http: HttpClient) { }

  createCategory(request : CategoryCreate): Observable<void>{
    return this.http.post<void>(`${API_URL_CATEGORY}/`, request);
  }

  getCategories(page: number, size: number, order: string): Observable<PaginationInfoResponse<Category>> {
    return this.http.get<PaginationInfoResponse<Category>>(`${API_URL_CATEGORY}/all?page=${page}&size=${size}&order=${order}`);
  }

}
