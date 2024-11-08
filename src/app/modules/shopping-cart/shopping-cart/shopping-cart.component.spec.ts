import { TestBed, ComponentFixture } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { ShoppingCartComponent } from "./shopping-cart.component";
import { ShoppingCartService } from "@/app/shared/services/shopping-cart.service";
import { CategoryService } from "@/app/shared/services/category.service";
import { BrandService } from "@/app/shared/services/brand.service";

describe("ShoppingCartComponent", () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  let mockShoppingCartService = {
    getArticlesFromShoppingCart: jest.fn().mockReturnValue(
      of({
        totalPrice: 100,
        articles: {
          list: [{ id: 1, quantity: 5, quantityRequired: 1 }],
          totalPages: 3,
          currentPage: 0,
          hasNextPage: true,
          hasPreviousPage: false,
          pageSize: 4,
          totalElements: 12,
        },
      })
    ),
    addToShoppingCart: jest.fn().mockReturnValue(of({})),
  };

  let mockCategoryService = {
    getAllCategories: jest.fn().mockReturnValue(
      of([
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
      ])
    ),
  };

  let mockBrandService = {
    getAllBrands: jest.fn().mockReturnValue(
      of([
        { id: 1, name: "Brand 1" },
        { id: 2, name: "Brand 2" },
      ])
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      providers: [
        { provide: ShoppingCartService, useValue: mockShoppingCartService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: BrandService, useValue: mockBrandService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should call getArticlesFromShoppingCart, getAllCategories, and getAllBrands", () => {
      const getArticlesSpy = jest.spyOn(
        component,
        "getArticlesFromShoppingCart"
      );
      component.ngOnInit();
      expect(getArticlesSpy).toHaveBeenCalled();
      expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
      expect(mockBrandService.getAllBrands).toHaveBeenCalled();
    });
  });

  describe("getArticlesFromShoppingCart", () => {
    it("should fetch articles with correct params", () => {
      component.getArticlesFromShoppingCart();
      expect(
        mockShoppingCartService.getArticlesFromShoppingCart
      ).toHaveBeenCalledWith(
        component.currentPage,
        4,
        "ASC",
        component.categoriesSelected,
        component.brandsSelected
      );
    });

    it("should handle API response correctly", () => {
      component.getArticlesFromShoppingCart();
      expect(component.articlesShoppingCart.totalPrice).toBe(100);
      expect(
        component.articlesShoppingCart.articles.list.length
      ).toBeGreaterThan(0);
    });
  });

  describe("onCategorySelected", () => {
    it("should add category to categoriesSelected on checkbox check", () => {
      const event = {
        target: { checked: true, value: "1" },
      } as unknown as Event;
      component.onCategorySelected(event);
      expect(component.categoriesSelected).toContain(1);
    });

    it("should remove category from categoriesSelected on checkbox uncheck", () => {
      component.categoriesSelected = [1];
      const event = {
        target: { checked: false, value: "1" },
      } as unknown as Event;
      component.onCategorySelected(event);
      expect(component.categoriesSelected).not.toContain(1);
    });
  });

  describe("onBrandSelected", () => {
    it("should add brand to brandsSelected on checkbox check", () => {
      const event = {
        target: { checked: true, value: "1" },
      } as unknown as Event;
      component.onBrandSelected(event);
      expect(component.brandsSelected).toContain(1);
    });

    it("should remove brand from brandsSelected on checkbox uncheck", () => {
      component.brandsSelected = [1];
      const event = {
        target: { checked: false, value: "1" },
      } as unknown as Event;
      component.onBrandSelected(event);
      expect(component.brandsSelected).not.toContain(1);
    });
  });

  describe("changeOrder", () => {
    it("should toggle order and call getArticlesFromShoppingCart ASC to DESC", () => {
      const spy = jest.spyOn(component, "getArticlesFromShoppingCart");
      component.changeOrder();
      expect(component.order).toBe("Descendentemente");
      expect(spy).toHaveBeenCalled();
    });

    it("should toggle order and call getArticlesFromShoppingCart DESC to ASC", () => {
      const spy = jest.spyOn(component, "getArticlesFromShoppingCart");
      component.order = "Descendentemente"
      component.changeOrder();
      expect(component.order).toBe("Ascendentemente");
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("quantityChange", () => {
    it("should update quantityRequired within limits", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 1,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      component.quantityChange(1, "3");
      expect(
        component.articlesShoppingCart.articles.list[0].quantityRequired
      ).toBe(3);
    });

    it("should update quantityRequired within limits", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 1,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      component.quantityChange(1, "0");
      expect(
        component.articlesShoppingCart.articles.list[0].quantityRequired
      ).toBe(1);
    });
    
    it("should update quantityRequired within limits maximum", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 1,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      component.quantityChange(1, "6");
      expect(
        component.articlesShoppingCart.articles.list[0].quantityRequired
      ).toBe(5);
    });

    it("should call addToShoppingCart with new quantity", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 1,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      const spy = jest.spyOn(mockShoppingCartService, "addToShoppingCart");
      component.quantityChange(1, "3");
      expect(spy).toHaveBeenCalledWith({ idArticle: 1, quantity: 3 });
    });
  });

  describe("toggleCategories", () => {
    it("should toggle isCategoriesVisible", () => {
      expect(component.isCategoriesVisible).toBe(false);
      component.toggleCategories();
      expect(component.isCategoriesVisible).toBe(true);
    });
  });

  describe("toggleBrands", () => {
    it("should toggle isBrandsVisible", () => {
      expect(component.isBrandsVisible).toBe(false);
      component.toggleBrands();
      expect(component.isBrandsVisible).toBe(true);
    });
  });

  describe("changePage", () => {
    it("should update currentPage and call getArticlesFromShoppingCart", () => {
      const spy = jest.spyOn(component, "getArticlesFromShoppingCart");
      component.changePage(2);
      expect(component.currentPage).toBe(2);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("increaseQuantity", () => {
    it("should increase quantityRequired and call addToShoppingCart", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 1,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      const spy = jest.spyOn(mockShoppingCartService, "addToShoppingCart");
      component.increaseQuantity(1);
      expect(
        component.articlesShoppingCart.articles.list[0].quantityRequired
      ).toBe(2);
      expect(spy).toHaveBeenCalledWith({ idArticle: 1, quantity: 2 });
    });
  });

  describe("decreaseQuantity", () => {
    it("should decrease quantityRequired and call addToShoppingCart", () => {
      component.articlesShoppingCart.articles.list = [
        {
          id: 1,
          quantity: 5,
          quantityRequired: 2,
          name: "test",
          description: "test",
          price: 10,
          brand: { id: 1, name: "test", description: "test" },
          categories: [],
          deliveryDate: new Date(),
        },
      ];
      const spy = jest.spyOn(mockShoppingCartService, "addToShoppingCart");
      component.decreaseQuantity(1);
      expect(
        component.articlesShoppingCart.articles.list[0].quantityRequired
      ).toBe(1);
      expect(spy).toHaveBeenCalledWith({ idArticle: 1, quantity: 1 });
    });
  });

  describe("getVisiblePages", () => {
    it("should return correct page indices", () => {
      component.articlesShoppingCart.articles.totalPages = 5;
      component.currentPage = 2;
      const pages = component.getVisiblePages();
      expect(pages).toEqual([0, 1, 2, 3, 4]);
    });
    it("should return correct page indices", () => {
      component.articlesShoppingCart.articles.totalPages = 10;
      component.currentPage = 1;
      const pages = component.getVisiblePages();
      expect(pages).toEqual([0, 1, 2, 3, 4, -1, 9]);
    });
    it("should return correct page indices", () => {
      component.articlesShoppingCart.articles.totalPages = 10;
      component.currentPage = 10;
      const pages = component.getVisiblePages();
      expect(pages).toEqual([0, -1, 5, 6, 7, 8, 9]);
    });

  });
});
