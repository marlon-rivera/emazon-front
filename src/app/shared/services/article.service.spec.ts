import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { CreateArticle } from '../interfaces/article.interface';
import { API_URL_ARTICLE } from '../utils/api.constants';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService]
    });

    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createArticle', () => {
    it('should make a POST request to create an article', () => {
      const mockCreateArticleRequest: CreateArticle = {
        name: 'Test Article',
        description: 'Test Description',
        brand: {
          id: 1,
          name: 'Brand',
          description: ''
        },
        categoriesIds: [1, 2, 3],
        price: 1000,
        quantity: 100
      };
      service.createArticle(mockCreateArticleRequest).subscribe();
      const req = httpMock.expectOne(`${API_URL_ARTICLE}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateArticleRequest);
      req.flush(null);
    });

    it('should handle errors when creating an article', () => {
      const mockCreateArticleRequest: CreateArticle = {
        name: 'Test Article',
        description: 'Test Description',
        brand: {
          id: 1,
          name: 'Brand',
          description: ''
        },
        categoriesIds: [1, 2, 3],
        price: 1000,
        quantity: 100
      };
      const errorMessage = 'Error creating article';

      let error: any;
      service.createArticle(mockCreateArticleRequest).subscribe({
        error: (e) => error = e
      });

      const req = httpMock.expectOne(`${API_URL_ARTICLE}/`);
      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error'
      });

      expect(error.status).toBe(500);
    });
  });
});