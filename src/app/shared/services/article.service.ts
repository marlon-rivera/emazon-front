import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { Article, CreateArticle } from "../interfaces/article.interface";
import { API_URL_ARTICLE, CRITERIA_ARTICLE_NAME } from "../utils/api.constants";
import {
  PaginationInfoResponse,
} from "../interfaces/pagination-info.interface";

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  constructor(readonly http: HttpClient) {}

  createArticle(request: CreateArticle): Observable<void> {
    return this.http.post<void>(`${API_URL_ARTICLE}/`, request);
  }

  getArticles(
    page: number,
    size: number,
    idsCategories?: number[],
    order?: string,
    sortBy?: string
  ): Observable<PaginationInfoResponse<Article>> {
    sortBy = sortBy === CRITERIA_ARTICLE_NAME ? 'name' : 'brand'
    return this.http.get<PaginationInfoResponse<Article>>(
      `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=${order}&sortBy=${sortBy}&idsCategories=${idsCategories}`
    ).pipe(
      catchError((error) => {
        const emptyResponse: PaginationInfoResponse<Article> = {
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
}
