import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CategoriesPanelPageComponent } from "./categories-panel-page.component";
import { CategoryService } from "src/core/services/category.service";
import { of } from "rxjs";
import { PaginationInfoResponse } from "src/core/interfaces/pagination-info.interface";
import { Category } from "src/core/interfaces/category.interface";
import { SIZE_PAGE, ASC_ORDER, DESC_ORDER } from "src/core/constants/api.constants";

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

    component.onPageChange(1);

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

  it("should change the sort order and fetch categories", () => {
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
    component.onSortChange("name");

    expect(component.currentSortOrder["name"]).toBe(ASC_ORDER);
    expect(categoryService.getCategories).toHaveBeenCalledWith(
      component.currentPage,
      SIZE_PAGE,
      ASC_ORDER
    );
  });
});
