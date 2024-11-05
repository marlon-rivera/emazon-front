import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { ArticleCardComponent } from "./article-card.component";
import { AuthService } from "@/app/shared/services/auth.service";
import { Article } from "@/app/shared/interfaces/article.interface";
import { WAREHOUSE_ROLE } from "@/app/shared/utils/api.constants";
import { of, throwError } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ShoppingCartService } from "@/app/shared/services/shopping-cart.service";

describe("ArticleCardComponent", () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;
  let authServiceMock: Partial<AuthService>;
  let shoppingCartServiceMock: jest.Mocked<ShoppingCartService>;

  const mockArticle: Article = {
    id: 1,
    name: "Test Article",
    description: "Test Description",
    brand: { id: 1, name: "Test bran", description: "Test description" },
    categories: [
      {
        id: 1,
        name: "Test category",
        description: "Test description",
      },
    ],
    price: 10000,
    quantity: 10,
  };

  beforeEach(async () => {
    authServiceMock = {
      infoToken: {
        role: WAREHOUSE_ROLE,
        name: "Test",
        email: "test@test.com",
        exp: 10002,
        iat: 10000,
        sub: "1",
      },
    };

    shoppingCartServiceMock = {
      addToShoppingCart: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<ShoppingCartService>;
    
    await TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ShoppingCartService, useValue: shoppingCartServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set warehouseAssistant to true if user role is WAREHOUSE_ROLE", () => {
    component.ngOnInit();
    expect(component.warehouseAssistant).toBe(true);
  });

  it("should set warehouseAssistant to false if user role is not WAREHOUSE_ROLE", () => {
    authServiceMock.infoToken!.role = "OTHER_ROLE";
    component.ngOnInit();
    expect(component.warehouseAssistant).toBe(false);
  });

  it("should emit openModal event with the article when onOpenModal is called", () => {
    const emitSpy = jest.spyOn(component.openModal, "emit");
    component.onOpenModal();
    expect(emitSpy).toHaveBeenCalledWith(mockArticle);
  });

  describe("model change", () => {
    it("should show modal to add item to shopping cart", () => {
      component.onOpenModalAddToCart();
      expect(component.showModalAddCart).toBeTruthy();
    });

    it("should close modal when onCloseModalAddToCart", () => {
      component.onCloseModalAddToCart();
      expect(component.showModalAddCart).toBeFalsy();
    });
  });

  describe("onSumbitArticleToAddShoppingCart", () => {
    it("should change valie when onChangeQuantityToAdd", () => {
      component.onChangeQuantityToAdd("5");
      expect(component.quantityToAdd.value).toBe("5");
    });

    it("should show notification when item is added", fakeAsync(() => {
      component.quantityToAdd.setValue(5);
      component.onSumbitArticleToAddShoppingCart();

      expect(shoppingCartServiceMock.addToShoppingCart).toHaveBeenCalledWith({
        idArticle: mockArticle.id,
        quantity: 5,
      });
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationMessage).toBe(
        "Producto agregado correctamente al carrito."
      );
      expect(component.notificationType).toBe("success");

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));

    it("should show error notificatoin when add fails", fakeAsync(() => {
      component.quantityToAdd.setValue(5);
      shoppingCartServiceMock.addToShoppingCart = jest.fn().mockReturnValue(
        throwError(() => ({
          error: {
            message: "Error al añadir al carrito",
          },
        }))
      );

      component.onSumbitArticleToAddShoppingCart();
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationType).toBe("error");
      expect(component.notificationMessage).toBe("Error al añadir al carrito");

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));
  });
});
