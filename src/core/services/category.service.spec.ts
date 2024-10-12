import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { CategoryCreate, Category } from '../interfaces/category.interface';
import { PaginationInfoResponse } from '../interfaces/pagination-info.interface';
import { API_URL_CATEGORY } from '../constants/api.constants';

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

  it('should create a category', () => {
    const categoryCreate: CategoryCreate = { name: 'New Category', description: 'Category Description' };
    
    service.createCategory(categoryCreate).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${API_URL_CATEGORY}/`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should fetch categories', () => {
    const mockResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        totalPages: 1,
        list: [
          {id: 1, name: 'Category 1', description: 'Description 1' },
          {id: 2, name: 'Category 2', description: 'Description 2' },
        ],
        currentPage:0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalElements: 2
      }
    };

    service.getCategories(1, 10, 'asc').subscribe(response => {
      expect(response.paginationInfo.totalPages).toBe(1);
      expect(response.paginationInfo.list.length).toBe(2);
    });

    const req = httpMock.expectOne(`${API_URL_CATEGORY}/all?page=1&size=10&order=asc`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
