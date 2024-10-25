import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category, CategoryCreate } from '@/app/shared/interfaces/category.interface';
import { PaginationInfoResponse } from '@/app/shared/interfaces/pagination-info.interface';
import { API_URL_CATEGORY } from '@/app/shared/utils/api.constants';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createCategory', () => {
    it('should make a POST request to create a category', () => {
      const mockCategoryCreate: CategoryCreate = {
        name: 'Test Category',
        description: 'Test Description'
      };

      service.createCategory(mockCategoryCreate).subscribe();

      const req = httpMock.expectOne(`${API_URL_CATEGORY}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCategoryCreate);

      req.flush(null);
    });

    it('should handle error when creating category fails', () => {
      const mockCategoryCreate: CategoryCreate = {
        name: 'Test Category',
        description: 'Test Description'
      };

      service.createCategory(mockCategoryCreate).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${API_URL_CATEGORY}/`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getCategories', () => {
    const mockPaginatedResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        list: [
          { id: 1, name: 'Category 1', description: 'Description 1' },
          { id: 2, name: 'Category 2', description: 'Description 2' }
        ],
        currentPage: 0,
        pageSize: 10,
        totalElements: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };

    it('should return paginated categories on successful request', () => {
      const page = 0;
      const size = 10;
      const order = 'asc';

      service.getCategories(page, size, order).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
        expect(response.paginationInfo.list.length).toBe(2);
        expect(response.paginationInfo.totalElements).toBe(2);
      });

      const req = httpMock.expectOne(
        `${API_URL_CATEGORY}/all?page=${page}&size=${size}&order=${order}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockPaginatedResponse);
    });

    it('should return empty response when error occurs', () => {
      const page = 0;
      const size = 10;
      const order = 'asc';

      service.getCategories(page, size, order).subscribe(response => {
        expect(response.paginationInfo.list).toEqual([]);
        expect(response.paginationInfo.totalElements).toBe(0);
        expect(response.paginationInfo.totalPages).toBe(0);
        expect(response.paginationInfo.hasNextPage).toBeFalsy();
        expect(response.paginationInfo.hasPreviousPage).toBeFalsy();
      });

      const req = httpMock.expectOne(
        `${API_URL_CATEGORY}/all?page=${page}&size=${size}&order=${order}`
      );
      
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle different page sizes correctly', () => {
      const page = 1;
      const size = 5;
      const order = 'desc';

      service.getCategories(page, size, order).subscribe();

      const req = httpMock.expectOne(
        `${API_URL_CATEGORY}/all?page=${page}&size=${size}&order=${order}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockPaginatedResponse);
    });
  });

  describe('getAllCategories', () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Category 1', description: 'Description 1' },
      { id: 2, name: 'Category 2', description: 'Description 2' },
      { id: 3, name: 'Category 3', description: 'Description 3' }
    ];

    it('should return all categories on successful request', () => {
      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(3);
      });

      const req = httpMock.expectOne(`${API_URL_CATEGORY}/allCategories`);
      expect(req.request.method).toBe('GET');

      req.flush(mockCategories);
    });

    it('should return empty array when error occurs', () => {
      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      const req = httpMock.expectOne(`${API_URL_CATEGORY}/allCategories`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle empty response', () => {
      service.getAllCategories().subscribe(categories => {
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      const req = httpMock.expectOne(`${API_URL_CATEGORY}/allCategories`);
      req.flush([]);
    });
  });

  describe('HTTP Error Handling', () => {
    it('should handle different HTTP status codes appropriately', () => {
      const httpErrorCodes = [400, 401, 403, 404, 500];
      
      httpErrorCodes.forEach(errorCode => {
        service.getAllCategories().subscribe({
          error: (error) => {
            if (errorCode >= 500) {
              expect(error.status).toBe(500);
              expect(error.statusText).toBe('Internal Server Error');
            } else {
              expect(error.status).toBe(errorCode);
            }
          }
        });

        const req = httpMock.expectOne(`${API_URL_CATEGORY}/allCategories`);
        req.flush('Error', { 
          status: errorCode, 
          statusText: errorCode === 500 ? 'Internal Server Error' : 'Client Error'
        });
      });
    });
  });
});