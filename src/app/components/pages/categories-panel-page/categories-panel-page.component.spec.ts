import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CategoriesPanelPageComponent } from "./categories-panel-page.component";
import { CategoryService } from "src/core/services/category.service";
import { of } from "rxjs";
import { PaginationInfoResponse } from "src/core/interfaces/pagination-info.interface";
import { Category } from "src/core/interfaces/category.interface";
import {
  SIZE_PAGE,
  ASC_ORDER,
  DESC_ORDER,
  NAME_CATEGORY,
} from "src/core/constants/api.constants";

describe("CategoriesPanelPageComponent", () => {
  let component: CategoriesPanelPageComponent;
  let fixture: ComponentFixture<CategoriesPanelPageComponent>;
  let categoryService: { getCategories: jest.Mock };

  beforeEach(async () => {
    categoryService = {
      getCategories: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CategoriesPanelPageComponent],
      providers: [{ provide: CategoryService, useValue: categoryService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesPanelPageComponent);
    component = fixture.componentInstance;
    component.maxVisiblePages = 5;

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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch categories on init", () => {
    const mockResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        currentPage: 0,
        pageSize: 2,
        totalElements: 4,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
        list: [
          { id: 1, name: "Category 1", description: "Description 1" },
          { id: 2, name: "Category 2", description: "Description 2" },
        ],
      },
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(categoryService.getCategories).toHaveBeenCalledWith(
      component.currentPage,
      SIZE_PAGE,
      component.currentSortOrder[component.headers[0].name]
    );
    expect(component.rows).toEqual([
      ["Category 1", "Description 1"],
      ["Category 2", "Description 2"],
    ]);
    expect(component.paginationInfo).toEqual(mockResponse.paginationInfo);
  });

  it("should change the page and fetch new categories", () => {
    const mockResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        currentPage: 1,
        pageSize: 2,
        totalElements: 4,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
        list: [
          { id: 3, name: "Category 3", description: "Description 3" },
          { id: 4, name: "Category 4", description: "Description 4" },
        ],
      },
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));
    component.paginationInfo.totalPages = 2;
    component.changePage(1);

    expect(component.currentPage).toBe(1);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      1,
      SIZE_PAGE,
      component.currentSortOrder[component.headers[0].name]
    );
    expect(component.rows).toEqual([
      ["Category 3", "Description 3"],
      ["Category 4", "Description 4"],
    ]);
  });

  describe("getVisiblePages", () => {
    it("should return all pages when totalPages is less than or equal to maxVisiblePages", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();
      expect(visiblePages).toEqual([0, 1, 2, 3, 4, -1, 9]);
    });

    it("should return correct visible pages when currentPage is in the middle", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 5;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, -1, 3, 4, 5, 6, 7, -1, 9]);
    });

    it("should return correct visible pages when currentPage is near the start", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();
      expect(visiblePages).toEqual([0, 1, 2, 3, 4, -1, 9]);
    });

    it("should return correct visible pages when currentPage is near the end", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 8;

      const visiblePages = component.getVisiblePages();
      expect(visiblePages).toEqual([0, -1, 5, 6, 7, 8, 9]);
    });

    it("should return correct visible pages with ellipsis at the beginning", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 4;

      const visiblePages = component.getVisiblePages();
      expect(visiblePages).toEqual([0, -1, 2, 3, 4, 5, 6, -1, 9]);
    });

    it("should return correct visible pages with ellipsis at the end", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 7;

      const visiblePages = component.getVisiblePages();
      expect(visiblePages).toEqual([0, -1, 5, 6, 7, 8, 9]);
    });
  });

  it("should return correct visible pages without ellipsis", () => {
    component.paginationInfo.totalPages = 5;
    component.currentPage = 0;

    const visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
  });

  it("should toggle sort order from ASC to DESC", () => {
    const mockResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        currentPage: 0,
        pageSize: 2,
        totalElements: 4,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
        list: [
          { id: 1, name: "Category 1", description: "Description 1" },
          { id: 2, name: "Category 2", description: "Description 2" },
        ],
      },
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));
    component.toggleSort(NAME_CATEGORY);
    expect(component.currentSortOrder[NAME_CATEGORY]).toBe(DESC_ORDER);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      component.currentPage,
      SIZE_PAGE,
      DESC_ORDER
    );
  });

  it("should toggle sort order from DESC to ASC", () => {
    const mockResponse: PaginationInfoResponse<Category> = {
      paginationInfo: {
        currentPage: 0,
        pageSize: 2,
        totalElements: 4,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
        list: [
          { id: 1, name: "Category 1", description: "Description 1" },
          { id: 2, name: "Category 2", description: "Description 2" },
        ],
      },
    };

    categoryService.getCategories.mockReturnValue(of(mockResponse));
    component.toggleSort(NAME_CATEGORY);

    expect(component.currentSortOrder[NAME_CATEGORY]).toBe(ASC_ORDER);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      component.currentPage,
      SIZE_PAGE,
      ASC_ORDER
    );
  });
});
