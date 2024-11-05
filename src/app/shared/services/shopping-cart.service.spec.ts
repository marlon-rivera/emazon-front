import { TestBed } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemToAddShoppingCart } from '../interfaces/shopping-cart.interface';
import { API_URL_SHOPPING_CART } from '../utils/api.constants';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShoppingCartService]
    });
    service = TestBed.inject(ShoppingCartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToShoppingCart', () => {
    it('should make a POST to add item to shopping cart', () => {
      const mockItem : ItemToAddShoppingCart = {
        idArticle: 1,
        quantity: 5
      };

      service.addToShoppingCart(mockItem).subscribe();

      const req = httpMock.expectOne(`${API_URL_SHOPPING_CART}/`)
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockItem);
    })
  })
});
