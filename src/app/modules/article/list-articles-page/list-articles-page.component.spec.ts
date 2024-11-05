import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule, FormControl } from "@angular/forms";
import { ListArticlesPageComponent } from "./list-articles-page.component";
import { ArticleService } from "@/app/shared/services/article.service";
import { CategoryService } from "@/app/shared/services/category.service";
import { of, throwError } from "rxjs";
import {
  ASC_ORDER,
  CRITERIA_ARTICLE_NAME,
  SIZE_PAGE,
} from "@/app/shared/utils/api.constants";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Article } from "@/app/shared/interfaces/article.interface";
import { SupplyService } from "@/app/shared/services/supply.service";
import { UiModule } from "@/app/ui/ui.module";
import { fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("ListArticlesPageComponent", () => {
  let component: ListArticlesPageComponent;
  let fixture: ComponentFixture<ListArticlesPageComponent>;
  let articleServiceMock: jest.Mocked<ArticleService>;
  let categoryServiceMock: jest.Mocked<CategoryService>;
  let supplyServiceMock: jest.Mocked<SupplyService>;

  const mockArticles = [
    { id: 1, name: "Article 1" },
    { id: 2, name: "Article 2" },
  ];

  const mockCategories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ];

  const mockArticle: Article = {
    id: 1,
    name: "Test",
    description: "Test",
    quantity: 10,
    price: 10000,
    brand: {
      id: 1,
      name: "Test",
      description: "Test",
    },
    categories: [
      {
        id: 1,
        name: "Test",
        description: "Test",
      },
    ],
  };

  const mockPaginationResponse = {
    paginationInfo: {
      list: mockArticles,
      totalPages: 2,
      currentPage: 0,
      hasNextPage: true,
      hasPreviousPage: false,
      pageSize: 10,
      totalElements: 15,
    },
  };

  beforeEach(async () => {
    articleServiceMock = {
      getArticles: jest.fn().mockReturnValue(of(mockPaginationResponse)),
    } as unknown as jest.Mocked<ArticleService>;

    categoryServiceMock = {
      getAllCategories: jest.fn().mockReturnValue(of(mockCategories)),
    } as unknown as jest.Mocked<CategoryService>;

    supplyServiceMock = {
      addSupply: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<SupplyService>;

    await TestBed.configureTestingModule({
      declarations: [ListArticlesPageComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, UiModule],
      providers: [
        FormBuilder,
        { provide: ArticleService, useValue: articleServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: SupplyService, useValue: supplyServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ListArticlesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with default values", () => {
    expect(component.currentPage).toBe(0);
    expect(component.categoriesSelected).toEqual([]);
    expect(component.isCategoriesVisible).toBeFalsy();
    expect(component.orderControl.value).toBe(ASC_ORDER);
    expect(component.criteriaControl.value).toBe(CRITERIA_ARTICLE_NAME);
    expect(component.showNotification).toBe(false);
    expect(component.notificationMessage).toBe("");
    expect(component.notificationType).toBe("success");
  });

  it("should load articles on init", () => {
    expect(articleServiceMock.getArticles).toHaveBeenCalledWith(
      0,
      SIZE_PAGE,
      [],
      ASC_ORDER,
      CRITERIA_ARTICLE_NAME
    );
    expect(component.articles).toEqual(mockArticles);
    expect(component.paginationInfo).toEqual(
      mockPaginationResponse.paginationInfo
    );
  });

  it("should load categories on init", () => {
    expect(categoryServiceMock.getAllCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(
      mockCategories.map((category) => ({
        id: category.id,
        name: category.name,
      }))
    );
  });

  it("should toggle categories visibility", () => {
    expect(component.isCategoriesVisible).toBeFalsy();
    component.toggleCategories();
    expect(component.isCategoriesVisible).toBeTruthy();
    component.toggleCategories();
    expect(component.isCategoriesVisible).toBeFalsy();
  });

  it("should change page and reload articles", () => {
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(articleServiceMock.getArticles).toHaveBeenCalledWith(
      1,
      SIZE_PAGE,
      [],
      ASC_ORDER,
      CRITERIA_ARTICLE_NAME
    );
  });

  it("should not change page if invalid page number", () => {
    const currentPage = component.currentPage;
    component.changePage(-1);
    expect(component.currentPage).toBe(currentPage);

    component.paginationInfo.totalPages = 5;
    component.changePage(5);
    expect(component.currentPage).toBe(currentPage);
  });

  it("should handle category selection", () => {
    const mockEvent = {
      target: {
        checked: true,
        value: "1",
      },
    } as unknown as Event;

    component.onCategorySelected(mockEvent);
    expect(component.categoriesSelected).toContain(1);
    expect(articleServiceMock.getArticles).toHaveBeenCalled();

    const mockUncheckedEvent = {
      target: {
        checked: false,
        value: "1",
      },
    } as unknown as Event;

    component.onCategorySelected(mockUncheckedEvent);
    expect(component.categoriesSelected).not.toContain(1);
  });

  it("should handle order change", () => {
    const newOrder = { id: 1, name: "DESC" };
    component.onChangeOrder(newOrder);
    expect(component.orderControl.value).toBe("DESC");
  });

  it("should handle criteria change", () => {
    const newCriteria = { id: 1, name: "date" };
    component.onChangeCriteria(newCriteria);
    expect(component.criteriaControl.value).toBe("date");
  });

  it("should calculate visible pages correctly", () => {
    component.paginationInfo.totalPages = 3;
    component.currentPage = 1;
    let visiblePages = component.getVisiblePages();
    expect(visiblePages).toEqual([0, 1, 2]);

    component.paginationInfo.totalPages = 10;
    component.currentPage = 5;
    visiblePages = component.getVisiblePages();
    expect(visiblePages[0]).toBe(0);
    expect(visiblePages[visiblePages.length - 1]).toBe(9);
    expect(visiblePages).toContain(5);
  });

  describe("getVisiblePages", () => {
    beforeEach(() => {
      component.maxVisiblePages = 5;
    });

    it("should handle case when currentPage is less than or equal to halfWindow", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2, 3, 4, -1, 9]);
    });

    it("should handle case when currentPage is near the end", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 8;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, -1, 5, 6, 7, 8, 9]);
    });

    it("should handle case when we have exactly maxVisiblePages number of pages", () => {
      component.paginationInfo.totalPages = 5;
      component.currentPage = 2;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
    });

    it("should handle case when we have fewer than maxVisiblePages pages", () => {
      component.paginationInfo.totalPages = 3;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2]);
    });

    it("should handle case when currentPage is in the middle", () => {
      component.paginationInfo.totalPages = 10;
      component.currentPage = 4;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, -1, 2, 3, 4, 5, 6, -1, 9]);
    });

    it("should handle edge case with minimal number of pages", () => {
      component.paginationInfo.totalPages = 1;
      component.currentPage = 0;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0]);
    });
  });

  describe("onSubmitQuantityToAdd", () => {
    it("should change valie when onChangeQuantityToAdd", () => {
      component.onChangeQuantityToAdd("5");
      expect(component.quantityToAdd.value).toBe("5");
    });

    it("should show notification when adding supply is successful", fakeAsync(() => {
      component.selectedArticle = mockArticle;
      component.quantityToAdd.setValue(5);
      component.onSumbitQuantityToAdd();

      expect(supplyServiceMock.addSupply).toHaveBeenCalledWith({
        idArticle: mockArticle.id,
        quantity: 5,
      });
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationMessage).toBe(
        "Suministro agregado correctamente."
      );
      expect(component.notificationType).toBe("success");

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));

    it("should show error notification when adding supply fails", fakeAsync(() => {
      component.selectedArticle = mockArticle;
      component.quantityToAdd.setValue(5);
      supplyServiceMock.addSupply = jest.fn().mockReturnValue(
        throwError(() => ({
          error: {
            message: "Error al añadir suministro",
          },
        }))
      );

      component.onSumbitQuantityToAdd();
      expect(component.showNotification).toBe(true);
      expect(component.notificationMessage).toBe("Error al añadir suministro");
      expect(component.notificationType).toBe("error");

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));
  });

  describe("modal change", () => {
    it("should show modal when click addSupply", () => {
      component.onOpenModal(mockArticle);
      expect(component.showModal).toBeTruthy();
      expect(component.selectedArticle).toBe(mockArticle);
    });
    it("should close modal when click X", () => {
      component.showModal = true;
      component.onCloseModal();
      expect(component.showModal).toBeFalsy();
      expect(component.quantityToAdd.value).toBe(0);
      expect(component.selectedArticle).toBe(null);
    });
  });
});
