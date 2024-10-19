import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { BrandService } from "./brand.service";
import { Brand, BrandCreate } from "../interfaces/brandinterface";
import { API_URL_BRAND } from "../constants/api.constants";
import { PaginationInfoResponse } from "../interfaces/pagination-info.interface";

describe("BrandService", () => {
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

  afterEach(()=>{
    httpMock.verify();
  })

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it('should create a brand', () => {
    const brandCreate: BrandCreate = {name: 'New brand', 'description' : 'Brand description'};
    service.createBrand(brandCreate).subscribe(response =>{
      expect(response).toBeUndefined();
    });
    const req = httpMock.expectOne(`${API_URL_BRAND}/`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  })

  it('should fetch brands', ()=>{
    const mockResponse: PaginationInfoResponse<Brand> = {
      paginationInfo: {
        totalPages: 1,
        list:[
          {id: 1, name: 'Brand1', description: 'description1'}
        ],
        currentPage: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 10,
        totalElements: 1
      }
    };
    service.getBrands(0, 10, 'ASC').subscribe(response => {
      expect(response.paginationInfo.totalPages).toBe(1);
      expect(response.paginationInfo.list.length).toBe(1)
    });

    const req = httpMock.expectOne(`${API_URL_BRAND}/all?page=0&size=10&order=ASC`);
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse);
  })
});
