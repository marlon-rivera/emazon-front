import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemToAddShoppingCart } from '../interfaces/shopping-cart.interface';
import { API_URL_SHOPPING_CART } from '../utils/api.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(readonly http: HttpClient) { }

  addToShoppingCart(request: ItemToAddShoppingCart): Observable<void>{
    return this.http.post<void>(`${API_URL_SHOPPING_CART}/`, request);
  }

}
