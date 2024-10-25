import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandService } from './brand.service';
import { Brand, BrandCreate } from 'src/app/shared/interfaces/brandinterface';
import { PaginationInfoResponse } from '@/app/shared/interfaces/pagination-info.interface';
import { API_URL_BRAND } from '@/app/shared/utils/api.constants';

describe('BrandService', () => {
  let service: BrandService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandService]
    });

    service = TestBed.inject(BrandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createBrand', () => {
    it('should make a POST request to create a brand', () => {
      const mockBrandCreate: BrandCreate = {
        name: 'Test Brand',
        description: 'Test Description'
      };

      service.createBrand(mockBrandCreate).subscribe();

      const req = httpMock.expectOne(`${API_URL_BRAND}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockBrandCreate);

      req.flush(null);
    });
  });

  describe('getBrands', () => {
    it('should return paginated brands on successful request', () => {
      const page = 0;
      const size = 10;
      const order = 'asc';

      const mockResponse: PaginationInfoResponse<Brand> = {
        paginationInfo: {
          list: [
            { id: 1, name: 'Brand 1', description: 'Description 1' },
            { id: 2, name: 'Brand 2', description: 'Description 2' }
          ],
          currentPage: 0,
          pageSize: 10,
          totalElements: 2,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };

      service.getBrands(page, size, order).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${API_URL_BRAND}/all?page=${page}&size=${size}&order=${order}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });

    it('should return empty response on error', () => {
      const page = 0;
      const size = 10;
      const order = 'asc';

      service.getBrands(page, size, order).subscribe(response => {
        expect(response.paginationInfo.list).toEqual([]);
        expect(response.paginationInfo.totalElements).toBe(0);
        expect(response.paginationInfo.totalPages).toBe(0);
      });

      const req = httpMock.expectOne(
        `${API_URL_BRAND}/all?page=${page}&size=${size}&order=${order}`
      );
      
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getAllBrands', () => {
    it('should return all brands on successful request', () => {
      const mockBrands: Brand[] = [
        { id: 1, name: 'Brand 1', description: 'Description 1' },
        { id: 2, name: 'Brand 2', description: 'Description 2' }
      ];

      service.getAllBrands().subscribe(brands => {
        expect(brands).toEqual(mockBrands);
      });

      const req = httpMock.expectOne(`${API_URL_BRAND}/allBrands`);
      expect(req.request.method).toBe('GET');

      req.flush(mockBrands);
    });

    it('should return empty array on error', () => {
      service.getAllBrands().subscribe(brands => {
        expect(brands).toEqual([]);
      });

      const req = httpMock.expectOne(`${API_URL_BRAND}/allBrands`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle empty response', () => {
      service.getAllBrands().subscribe(brands => {
        expect(brands).toEqual([]);
      });

      const req = httpMock.expectOne(`${API_URL_BRAND}/allBrands`);
      req.flush([]);
    });
  });

  describe('HTTP Error Handling', () => {
    it('should handle different types of HTTP errors gracefully', () => {
      const mockBrandCreate: BrandCreate = {
        name: 'Test Brand',
        description: 'Test Description'
      };

      service.createBrand(mockBrandCreate).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      let req = httpMock.expectOne(`${API_URL_BRAND}/`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      service.createBrand(mockBrandCreate).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      req = httpMock.expectOne(`${API_URL_BRAND}/`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});