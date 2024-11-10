import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ArticlesShoppinCart, ItemToAddShoppingCart } from "../interfaces/shopping-cart.interface";
import { API_URL_SHOPPING_CART } from "../utils/api.constants";
import { catchError, Observable, of } from "rxjs";
import { PaginationInfoResponse } from "../interfaces/pagination-info.interface";
import { Article } from "../interfaces/article.interface";

@Injectable({
  providedIn: "root",
})
export class ShoppingCartService {
  constructor(readonly http: HttpClient) {}

  addToShoppingCart(request: ItemToAddShoppingCart): Observable<void> {
    return this.http.post<void>(`${API_URL_SHOPPING_CART}/`, request);
  }

  getArticlesFromShoppingCart(
    page: number,
    size: number,
    order?: string,
    idsCategories?: number[],
    idsBrands?: number[]
  ): Observable<ArticlesShoppinCart> {
    return this.http.get<ArticlesShoppinCart>(
      `${API_URL_SHOPPING_CART}/?page=${page}&size=${size}&idsCategories=${idsCategories}&idsBrands=${idsBrands}&order=${order}`
    ).pipe(
      catchError((err) => {
        const emptyResponse: ArticlesShoppinCart = {
          articles: {
            list: [],
            currentPage: 0,
            pageSize: size,
            totalElements: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          },
          totalPrice: 0,
          modificationDate: null
        };
        return of(emptyResponse);
      })
    );
  }

  deleteArticleFromShoppingCart(idArticle: number): Observable<void>{
    return this.http.delete<void>(`${API_URL_SHOPPING_CART}/${idArticle}`);
  }
}
