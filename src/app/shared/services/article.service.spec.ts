import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { CreateArticle } from '../interfaces/article.interface';
import { API_URL_ARTICLE, CRITERIA_ARTICLE_NAME } from '../utils/api.constants';

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

  describe('getArticles', () => {
    const mockResponse = {
      paginationInfo: {
        list: [
          {
            id: 1,
            name: 'Article 1',
            description: 'Description 1',
            price: 100,
            quantity: 10,
            brand: { id: 1, name: 'Brand 1', description: '' },
            categories: []
          }
        ],
        currentPage: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };

    it('should make a GET request with correct parameters', () => {
      const page = 0;
      const size = 10;
      const idsCategories = [1, 2];
      const order = 'ASC';
      const sortBy = CRITERIA_ARTICLE_NAME;

      service.getArticles(page, size, idsCategories, order, sortBy).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=${order}&sortBy=name&idsCategories=${idsCategories}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle sortBy correctly when not CRITERIA_ARTICLE_NAME', () => {
      const page = 0;
      const size = 10;
      const sortBy = 'other';

      service.getArticles(page, size, [], 'ASC', sortBy).subscribe();

      const req = httpMock.expectOne(
        `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=ASC&sortBy=brand&idsCategories=`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle errors and return empty response', () => {
      const page = 0;
      const size = 10;

      service.getArticles(page, size).subscribe(response => {
        expect(response.paginationInfo.list).toEqual([]);
        expect(response.paginationInfo.totalElements).toBe(0);
        expect(response.paginationInfo.currentPage).toBe(0);
      });

      const req = httpMock.expectOne(
        `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=undefined&sortBy=brand&idsCategories=undefined`
      );
      req.error(new ErrorEvent('Network error'));
    });

    it('should make request without optional parameters', () => {
      const page = 0;
      const size = 10;

      service.getArticles(page, size).subscribe();

      const req = httpMock.expectOne(
        `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=undefined&sortBy=brand&idsCategories=undefined`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty categories array', () => {
      const page = 0;
      const size = 10;
      const idsCategories: number[] = [];

      service.getArticles(page, size, idsCategories).subscribe();

      const req = httpMock.expectOne(
        `${API_URL_ARTICLE}/all?page=${page}&size=${size}&order=undefined&sortBy=brand&idsCategories=`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});