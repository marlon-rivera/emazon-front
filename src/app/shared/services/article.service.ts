import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateArticle } from '../interfaces/article.interface';
import { API_URL_ARTICLE } from '../utils/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(readonly http: HttpClient) { }

  createArticle(request: CreateArticle): Observable<void>{
    return this.http.post<void>(`${API_URL_ARTICLE}/`, request)
  }
}
