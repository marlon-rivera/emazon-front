import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ShoppingCartComponent } from "./shopping-cart.component";
import { ShoppingCartService } from "@/app/shared/services/shopping-cart.service";
import { CategoryService } from "@/app/shared/services/category.service";
import { BrandService } from "@/app/shared/services/brand.service";
import { of, throwError } from "rxjs";
import {
  ASC_ORDER,
  DESC_ORDER,
  NOTIFICATION_TYPE,
} from "@/app/shared/utils/api.constants";
import { UiModule } from "@/app/ui/ui.module";

jest.mock("@/app/shared/services/shopping-cart.service");
jest.mock("@/app/shared/services/category.service");
jest.mock("@/app/shared/services/brand.service");

describe("ShoppingCartComponent", () => {
  let component: ShoppingCartComponent;
  let shoppingCartService: jest.Mocked<ShoppingCartService>;
  let categoryService: jest.Mocked<CategoryService>;
  let brandService: jest.Mocked<BrandService>;

  const mockArticlesResponse = {
    totalPrice: 100,
    articles: {
      list: [
        {
          id: 1,
          name: "Article 1",
          quantity: 10,
          quantityRequired: 2,
          description: "",
          price: 10,
          categories: [{ id: 1, name: "", description: "" }],
          brand: { id: 1, name: "", description: "" },
          deliveryDate: new Date(),
        },
        {
          id: 2,
          name: "Article 2",
          quantity: 5,
          quantityRequired: 1,
          description: "",
          price: 10,
          categories: [{ id: 1, name: "", description: "" }],
          brand: { id: 1, name: "", description: "" },
          deliveryDate: new Date(),
        },
      ],
      totalPages: 3,
      currentPage: 0,
      hasNextPage: true,
      hasPreviousPage: false,
      pageSize: 4,
      totalElements: 10,
    },
    modificationDate: new Date(),
  };

  const mockCategories = [
    { id: 1, name: "Category 1", description: "" },
    { id: 2, name: "Category 2", description: "" },
  ];

  const mockBrands = [
    { id: 1, name: "Brand 1", description: "" },
    { id: 2, name: "Brand 2", description: "" },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      imports: [UiModule],
      providers: [ShoppingCartService, CategoryService, BrandService],
    });

    shoppingCartService = TestBed.inject(
      ShoppingCartService
    ) as jest.Mocked<ShoppingCartService>;
    categoryService = TestBed.inject(
      CategoryService
    ) as jest.Mocked<CategoryService>;
    brandService = TestBed.inject(BrandService) as jest.Mocked<BrandService>;

    shoppingCartService.getArticlesFromShoppingCart.mockReturnValue(
      of(mockArticlesResponse)
    );
    shoppingCartService.addToShoppingCart.mockReturnValue(of());
    categoryService.getAllCategories.mockReturnValue(of(mockCategories));
    brandService.getAllBrands.mockReturnValue(of(mockBrands));

    component = TestBed.createComponent(
      ShoppingCartComponent
    ).componentInstance;
  });

  describe("initialization", () => {
    test("should initialize with default values", () => {
      expect(component.currentPage).toBe(0);
      expect(component.categoriesSelected).toEqual([]);
      expect(component.brandsSelected).toEqual([]);
      expect(component.order).toBe("Ascendentemente");
    });

    test("should load initial data on ngOnInit", () => {
      component.ngOnInit();

      expect(
        shoppingCartService.getArticlesFromShoppingCart
      ).toHaveBeenCalled();
      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(brandService.getAllBrands).toHaveBeenCalled();
    });
  });

  describe("getArticlesFromShoppingCart", () => {
    test("should fetch articles with ascending order", () => {
      component.order = "Ascendentemente";
      component.getArticlesFromShoppingCart();

      expect(
        shoppingCartService.getArticlesFromShoppingCart
      ).toHaveBeenCalledWith(0, 4, ASC_ORDER, [], []);
    });

    test("should fetch articles with descending order", () => {
      component.order = "Descendentemente";
      component.getArticlesFromShoppingCart();

      expect(
        shoppingCartService.getArticlesFromShoppingCart
      ).toHaveBeenCalledWith(0, 4, DESC_ORDER, [], []);
    });
  });

  describe("category selection", () => {
    test("should add category when selected", () => {
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Category 1",
        },
      } as unknown as Event;

      document.body.innerHTML = `<input id="C1" type="checkbox" checked>`;
      component.categoriesSelected = [{ id: 2, name: "Category 2" }];      
      component.onCategorySelected(mockEvent);
      expect(component.categoriesSelected).toEqual([
        { id: 2, name: "Category 2" },
        { id: 1, name: "Category 1" },
      ]);
    });

    test("should add category when not selected", () => {
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Category 1",
        },
      } as unknown as Event;

      document.body.innerHTML = `<input id="C1" type="checkbox" checked>`;
      component.onCategorySelected(mockEvent);

      expect(component.categoriesSelected).toEqual([
        { id: 1, name: "Category 1" },
      ]);
    });

    test("should remove category when unchecked", () => {
      component.categoriesSelected = [{ id: 1, name: "Category 1" }];
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Category 1",
        },
      } as unknown as Event;

      document.body.innerHTML = `<input id="C1" type="checkbox">`;

      component.onCategorySelected(mockEvent);

      expect(component.categoriesSelected).toEqual([]);
    });
  });

  describe("brand selection", () => {
    test("should add brand when selected", () => {
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Brand 1",
        },
      } as unknown as Event;
      component.brandsSelected = [{ id: 2, name: "Brand 2" }];
      document.body.innerHTML = `<input id="B1" type="checkbox" checked>`;

      component.onBrandSelected(mockEvent);

      expect(component.brandsSelected).toEqual([
        { id: 2, name: "Brand 2" },
        { id: 1, name: "Brand 1" },
      ]);
    });

    test("should add brand when not selected", () => {
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Brand 1",
        },
      } as unknown as Event;
      component.brandsSelected = [];
      document.body.innerHTML = `<input id="B1" type="checkbox" checked>`;

      component.onBrandSelected(mockEvent);

      expect(component.brandsSelected).toEqual([{ id: 1, name: "Brand 1" }]);
    });

    test("should remove brand when unchecked", () => {
      component.brandsSelected = [{ id: 1, name: "Brand 1" }];
      const mockEvent = {
        target: {
          getAttribute: (attr: string) =>
            attr === "data-id" ? "1" : "Brand 1",
        },
      } as unknown as Event;

      document.body.innerHTML = `<input id="B1" type="checkbox">`;

      component.onBrandSelected(mockEvent);

      expect(component.brandsSelected).toEqual([]);
    });
  });

  describe("order handling", () => {
    test("should toggle order from ascending to descending", () => {
      component.order = "Ascendentemente";
      component.changeOrder();
      expect(component.order).toBe("Descendentemente");
    });

    test("should toggle order from descending to ascending", () => {
      component.order = "Descendentemente";
      component.changeOrder();
      expect(component.order).toBe("Ascendentemente");
    });
  });

  describe("quantity management", () => {
    test("should handle quantity change within valid range", () => {
      const article = mockArticlesResponse.articles.list[0];
      component.articlesShoppingCart = mockArticlesResponse;
      (shoppingCartService.addToShoppingCart as jest.Mock).mockReturnValue(of({}))
      component.quantityChange(1, "3");
      expect(shoppingCartService.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: 1,
        quantity: 3,
      });
    });

    test("should set quantity to 1 when input is less than 1", () => {
      const article = mockArticlesResponse.articles.list[0];
      component.articlesShoppingCart = mockArticlesResponse;

      component.quantityChange(article.id, "0");

      expect(shoppingCartService.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: article.id,
        quantity: 1,
      });
    });

    test("should limit quantity to available stock", () => {
      const article = mockArticlesResponse.articles.list[0];
      component.articlesShoppingCart = mockArticlesResponse;

      component.quantityChange(article.id, "15");

      expect(shoppingCartService.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: article.id,
        quantity: article.quantity,
      });
    });
  });

  describe("article deletion", () => {
    test("should delete article successfully", () => {
      (
        shoppingCartService.deleteArticleFromShoppingCart as jest.Mock
      ).mockReturnValue(of({}));
      jest.useFakeTimers();

      component.deleteArticle(1);
      expect(
        shoppingCartService.deleteArticleFromShoppingCart
      ).toHaveBeenCalledWith(1);
      expect(component.showNotification).toBe(true);
      expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);

      jest.advanceTimersByTime(3000);
      expect(component.showNotification).toBe(false);
    });

    test("should handle delete article error", () => {
      jest.useFakeTimers();
      shoppingCartService.deleteArticleFromShoppingCart.mockReturnValue(
        throwError(() => new Error())
      );

      component.deleteArticle(1);

      expect(component.showNotification).toBe(true);
      expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);

      jest.advanceTimersByTime(3000);
      expect(component.showNotification).toBe(false);
    });
  });

  describe("pagination", () => {
    test("should change page within valid range", () => {
      component.articlesShoppingCart = mockArticlesResponse;
      component.changePage(1);

      expect(component.currentPage).toBe(1);
      expect(
        shoppingCartService.getArticlesFromShoppingCart
      ).toHaveBeenCalled();
    });

    test("should not change page outside valid range", () => {
      component.articlesShoppingCart = mockArticlesResponse;
      const initialPage = component.currentPage;

      component.changePage(-1);
      expect(component.currentPage).toBe(initialPage);

      component.changePage(mockArticlesResponse.articles.totalPages);
      expect(component.currentPage).toBe(initialPage);
    });

    test("should calculate visible pages correctly", () => {
      component.articlesShoppingCart = mockArticlesResponse;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toContain(component.currentPage);
      expect(visiblePages.length).toBeLessThanOrEqual(
        component.maxVisiblePages
      );
    });

    it("should handle case when we have exactly maxVisiblePages number of pages", () => {
      component.articlesShoppingCart.articles.totalPages = 5;
      component.currentPage = 2;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2, 3, 4]);
    });

    it("should handle case when we have fewer than maxVisiblePages pages", () => {
      component.articlesShoppingCart.articles.totalPages = 3;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2]);
    });

    it("should handle case when currentPage is in the middle", () => {
      component.articlesShoppingCart.articles.totalPages = 10;
      component.currentPage = 4;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, -1, 2, 3, 4, 5, 6, -1, 9]);
    });

    it("should handle edge case with minimal number of pages", () => {
      component.articlesShoppingCart.articles.totalPages = 1;
      component.currentPage = 0;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0]);
    });

    it("should handle case when currentPage is less than or equal to halfWindow", () => {
      component.articlesShoppingCart.articles.totalPages = 10;
      component.currentPage = 1;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, 1, 2, 3, 4, -1, 9]);
    });

    it("should handle case when currentPage is near the end", () => {
      component.articlesShoppingCart.articles.totalPages = 10;
      component.currentPage = 8;

      const visiblePages = component.getVisiblePages();

      expect(visiblePages).toEqual([0, -1, 5, 6, 7, 8, 9]);
    });
  });

  describe("quantity controls", () => {
    test("should increase quantity", () => {
      component.articlesShoppingCart = mockArticlesResponse;
      const article = mockArticlesResponse.articles.list[0];
      const initialQuantity = article.quantityRequired;
      (shoppingCartService.addToShoppingCart as jest.Mock).mockReturnValue(of({}))
      component.increaseQuantity(article.id);

      expect(shoppingCartService.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: article.id,
        quantity: initialQuantity + 1,
      });
    });

    test("should decrease quantity if greater than 1", () => {
      component.articlesShoppingCart = mockArticlesResponse;
      const article = mockArticlesResponse.articles.list[0];
      const initialQuantity = article.quantityRequired;
      (shoppingCartService.addToShoppingCart as jest.Mock).mockReturnValue(of({}))
      component.decreaseQuantity(article.id);

      expect(shoppingCartService.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: article.id,
        quantity: initialQuantity - 1,
      });
    });

    test("should not decrease quantity if at minimum", () => {
      component.articlesShoppingCart = {
        ...mockArticlesResponse,
        articles: {
          ...mockArticlesResponse.articles,
          list: [
            { ...mockArticlesResponse.articles.list[0], quantityRequired: 1 },
          ],
        },
      };
      const article = component.articlesShoppingCart.articles.list[0];

      component.decreaseQuantity(article.id);

      expect(shoppingCartService.addToShoppingCart).not.toHaveBeenCalled();
    });
  });

  describe("visibility toggles", () => {
    test("should toggle categories visibility", () => {
      const initialState = component.isCategoriesVisible;
      component.toggleCategories();
      expect(component.isCategoriesVisible).toBe(!initialState);
    });

    test("should toggle brands visibility", () => {
      const initialState = component.isBrandsVisible;
      component.toggleBrands();
      expect(component.isBrandsVisible).toBe(!initialState);
    });
  });

  describe("to String number", () => {
    test("Convert number to string", () => {
      const number = component.toString(1);
      expect(number).toBe("1");
    });
  });
});
