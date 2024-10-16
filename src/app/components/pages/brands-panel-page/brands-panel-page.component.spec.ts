import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { BrandsPanelPageComponent } from "./brands-panel-page.component";
import { BrandService } from "@/core/services/brand.service";
import { Brand } from "@/core/interfaces/brandinterface";
import {
  PaginationInfo,
  PaginationInfoResponse,
} from "@/core/interfaces/pagination-info.interface";
import {
  ASC_ORDER,
  DESC_ORDER,
  MAX_VISIBLE_PAGES,
  NAME_BRAND,
  SIZE_PAGE,
} from "@/core/constants/api.constants";

describe("BrandsPanelPageComponent", () => {
  let component: BrandsPanelPageComponent;
  let fixture: ComponentFixture<BrandsPanelPageComponent>;
  let brandService: { getBrands: jest.Mock};

  beforeEach(async () => {
    brandService = {
      getBrands: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BrandsPanelPageComponent],
      providers: [{ provide: BrandService, useValue: brandService }],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsPanelPageComponent);
    component = fixture.componentInstance;
    component.maxVisiblePages = MAX_VISIBLE_PAGES;
    component.paginationInfo = {
      currentPage: 0,
      pageSize: 2,
      totalElements: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      list: [],
    };
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.currentPage).toBe(0);
    expect(component.maxVisiblePages).toBe(5);
    expect(component.currentSortOrder).toEqual({ [NAME_BRAND]: ASC_ORDER });
  });

  it("should call getBrands on ngOnInit", () => {
    const mockResponse: PaginationInfoResponse<Brand> = {
      paginationInfo: {
        currentPage: 0,
        pageSize: 2,
        totalElements: 4,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
        list: [
          { id: 1, name: "Brand 1", description: "Description 1" },
          { id: 2, name: "Brand 2", description: "Description 2" },
        ],
      },
    };
    brandService.getBrands.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(brandService.getBrands).toHaveBeenCalledWith(
      component.currentPage,
      SIZE_PAGE,
      ASC_ORDER
    );
    expect(component.rows).toEqual([
      ["Brand 1", "Description 1"],
      ["Brand 2", "Description 2"]
    ]);
    expect(component.paginationInfo).toEqual(mockResponse.paginationInfo);
  });

  it("should update currentSortOrder and call getBrands on sort change", () => {
    const headerName = NAME_BRAND;
    const mockPaginationInfo: PaginationInfo<Brand> = {
      list: [{ id: 1, name: "Marca 1", description: "Descripción 1" }],
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      pageSize: 10,
      totalElements: 1,
    };
    brandService.getBrands.mockReturnValue(
      of({ paginationInfo: mockPaginationInfo })
    );

    component.onSortChange(headerName);

    expect(component.currentSortOrder[headerName]).toBe(DESC_ORDER);
    expect(brandService.getBrands).toHaveBeenCalledWith(
      0,
      SIZE_PAGE,
      DESC_ORDER
    );
  });

  it("should update currentSortOrder and call getBrands on sort change DESC to ASC", () => {
    const headerName = NAME_BRAND;
    component.currentSortOrder[NAME_BRAND] = DESC_ORDER;
    const mockPaginationInfo: PaginationInfo<Brand> = {
      list: [{ id: 1, name: "Marca 1", description: "Descripción 1" }],
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      pageSize: 10,
      totalElements: 1,
    };
    brandService.getBrands.mockReturnValue(
      of({ paginationInfo: mockPaginationInfo })
    );

    component.onSortChange(headerName);

    expect(component.currentSortOrder[headerName]).toBe(ASC_ORDER);
    expect(brandService.getBrands).toHaveBeenCalledWith(
      0,
      SIZE_PAGE,
      ASC_ORDER
    );
  });

  it("should update currentPage and call getBrands on page change", () => {
    const page = 2;
    const mockPaginationInfo: PaginationInfo<Brand> = {
      list: [{ id: 3, name: "Marca 3", description: "Descripción 3" }],
      totalPages: 2,
      currentPage: 2,
      hasNextPage: true,
      hasPreviousPage: true,
      pageSize: 10,
      totalElements: 1,
    };
    brandService.getBrands.mockReturnValue(
      of({ paginationInfo: mockPaginationInfo })
    );

    component.onPageChange(page);

    expect(component.currentPage).toBe(2);
    expect(brandService.getBrands).toHaveBeenCalledWith(
      2,
      SIZE_PAGE,
      ASC_ORDER
    );
  });
});
