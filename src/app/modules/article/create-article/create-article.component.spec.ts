import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CreateArticleComponent } from "./create-article.component";
import { ArticleService } from "@/app/shared/services/article.service";
import { CategoryService } from "@/app/shared/services/category.service";
import { BrandService } from "@/app/shared/services/brand.service";
import { NOTIFICATION_TYPE } from "@/app/shared/utils/api.constants";
import { of, throwError } from "rxjs";
import { UiModule } from "@/app/ui/ui.module";

describe("CreateArticleComponent", () => {
  let component: CreateArticleComponent;
  let fixture: ComponentFixture<CreateArticleComponent>;
  let articleService: jest.Mocked<ArticleService>;
  let categoryService: jest.Mocked<CategoryService>;
  let brandService: jest.Mocked<BrandService>;

  const mockCategories = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
  ];

  const mockBrands = [
    { id: 1, name: "Brand 1" },
    { id: 2, name: "Brand 2" },
  ];

  beforeEach(async () => {
    articleService = {
      createArticle: jest.fn(),
    } as any;

    categoryService = {
      getAllCategories: jest.fn().mockReturnValue(of(mockCategories)),
    } as any;

    brandService = {
      getAllBrands: jest.fn().mockReturnValue(of(mockBrands)),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CreateArticleComponent],
      imports: [ReactiveFormsModule, UiModule],
      providers: [
        FormBuilder,
        { provide: ArticleService, useValue: articleService },
        { provide: CategoryService, useValue: categoryService },
        { provide: BrandService, useValue: brandService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should load categories on init", () => {
      expect(categoryService.getAllCategories).toHaveBeenCalled();
      expect(component.categoryOptions).toEqual(
        mockCategories.map((category) => ({
          id: category.id,
          name: category.name,
        }))
      );
    });

    it("should load brands on init", () => {
      expect(brandService.getAllBrands).toHaveBeenCalled();
      expect(component.brandOptions).toEqual(
        mockBrands.map((brand) => ({
          id: brand.id,
          name: brand.name,
        }))
      );
    });

    it("should initialize form with required fields", () => {
      expect(component.articleForm.get("name")).toBeTruthy();
      expect(component.articleForm.get("description")).toBeTruthy();
      expect(component.articleForm.get("quantity")).toBeTruthy();
      expect(component.articleForm.get("price")).toBeTruthy();
      expect(component.articleForm.get("brand")).toBeTruthy();
      expect(component.articleForm.get("brandId")).toBeTruthy();
      expect(component.articleForm.get("categories")).toBeTruthy();
    });
  });

  describe("Form Validators", () => {
    it("should be invalid when empty", () => {
      expect(component.articleForm.valid).toBeFalsy();
    });

    describe("Name Validator", () => {
      it("should be invalid when empty", () => {
        const name = component.articleForm.get("name");
        expect(name?.valid).toBeFalsy();
        expect(name?.errors?.["required"]).toBeTruthy();
      });

      it("should be valid with a name", () => {
        const name = component.articleForm.get("name");
        name?.setValue("Test Article");
        expect(name?.valid).toBeTruthy();
      });
    });

    describe("Quantity Validator", () => {
      it("should be invalid with quantity less than 1", () => {
        const quantity = component.articleForm.get("quantity");
        quantity?.setValue(0);
        expect(quantity?.valid).toBeFalsy();
        expect(quantity?.errors?.["min"]).toBeTruthy();
      });

      it("should be invalid with non-numeric values", () => {
        const quantity = component.articleForm.get("quantity");
        quantity?.setValue("abc");
        expect(quantity?.valid).toBeFalsy();
        expect(quantity?.errors?.["pattern"]).toBeTruthy();
      });

      it("should be valid with valid quantity", () => {
        const quantity = component.articleForm.get("quantity");
        quantity?.setValue(5);
        expect(quantity?.valid).toBeTruthy();
      });
    });

    describe("Price Validator", () => {
      it("should be invalid with price less than 0.01", () => {
        const price = component.articleForm.get("price");
        price?.setValue(0);
        expect(price?.valid).toBeFalsy();
        expect(price?.errors?.["min"]).toBeTruthy();
      });

      it("should be invalid with incorrect format", () => {
        const price = component.articleForm.get("price");
        price?.setValue("12.345");
        expect(price?.valid).toBeFalsy();
        expect(price?.errors?.["pattern"]).toBeTruthy();
      });

      it("should be valid with correct price", () => {
        const price = component.articleForm.get("price");
        price?.setValue("12.34");
        expect(price?.valid).toBeTruthy();
      });
    });
  });

  describe("Component Methods", () => {
    describe("onCategoriesChange", () => {
      it("should update categories FormArray", () => {
        const mockSelectedCategories = [
          { id: 1, name: "Category 1" },
          { id: 2, name: "Category 2" },
        ];

        component.onCategoriesChange(mockSelectedCategories);

        const categoriesFormArray = component.articleForm.get("categories");
        expect(categoriesFormArray?.value).toEqual([1, 2]);
      });
    });

    describe("onBrandSelect", () => {
      it("should update brandId and brand when a brand is selected", () => {
        const mockBrand = { id: 1, name: "Test Brand" };
        const brandIdControl = component.articleForm.get("brandId");
        const brandControl = component.articleForm.get("brand");
        const spyBrandId = jest.spyOn(brandIdControl!, "setValue");
        const spyBrand = jest.spyOn(brandControl!, "setValue");

        component.onBrandSelect(mockBrand);

        expect(spyBrandId).toHaveBeenCalledWith(1);
        expect(spyBrand).toHaveBeenCalledWith("Test Brand");
        expect(brandIdControl?.value).toBe(1);
        expect(brandControl?.value).toBe("Test Brand");
      });

      it("should clear brandId and brand when event is null", () => {
        const brandIdControl = component.articleForm.get("brandId");
        const brandControl = component.articleForm.get("brand");

        brandIdControl?.setValue(1);
        brandControl?.setValue("Test Brand");

        const spyBrandId = jest.spyOn(brandIdControl!, "setValue");
        const spyBrand = jest.spyOn(brandControl!, "setValue");

        component.onBrandSelect(null);

        expect(spyBrandId).toHaveBeenCalledWith(null);
        expect(spyBrand).toHaveBeenCalledWith(null);
        expect(brandIdControl?.value).toBeNull();
        expect(brandControl?.value).toBeNull();
      });
    });

    describe("onSubmit", () => {
      beforeEach(() => {
        component.articleForm.patchValue({
          name: "Test Article",
          description: "Test Description",
          quantity: 1,
          price: 10.99,
        });
        component.onBrandSelect({ id: 1, name: "Brand 1" });
        component.onCategoriesChange([{ id: 1, name: "Category 1" }]);
      });

      it("should call createArticle when form is valid", () => {
        articleService.createArticle.mockReturnValue(of());
        component.onSubmit();

        expect(articleService.createArticle).toHaveBeenCalled();
      });

      it("should show success notification when article is created", () => {
        articleService.createArticle.mockReturnValue(of(void 0));

        component.onSubmit();
        expect(component.showNotification).toBeTruthy();
        expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
        expect(component.notificationMessage).toBe("Artículo creado con éxito");
      });

      it("should show error notification when creation fails", () => {
        const errorMessage = "Error creating article";
        articleService.createArticle.mockReturnValue(
          throwError(() => ({ error: { message: errorMessage } }))
        );

        component.onSubmit();

        expect(component.showNotification).toBeTruthy();
        expect(component.notificationType).toBe(NOTIFICATION_TYPE.ERROR);
        expect(component.notificationMessage).toBe(errorMessage);
      });
    });
  });

  describe("Category Validator", () => {
    describe("Category Validator", () => {
      it("should return null when control is not a FormArray", () => {
        const control = component.formBuilder.control(""); // Create a regular FormControl
        const result = component.categoryValidator(control);
        expect(result).toBeNull();
      });

      it("should be invalid with less categories than minimum", () => {
        const categoriesArray = component.articleForm.get("categories");
        expect(categoriesArray?.errors?.["categoryCountInvalid"]).toBeTruthy();
      });

      it("should be invalid with more categories than maximum", () => {
        const maxPlusOne = component.maxCategories + 1;
        const tooManyCategories = Array(maxPlusOne)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            name: `Category ${index + 1}`,
          }));

        component.onCategoriesChange(tooManyCategories);

        const categoriesArray = component.articleForm.get("categories");
        expect(categoriesArray?.errors?.["categoryCountInvalid"]).toBeTruthy();
      });

      it("should be valid with correct number of categories", () => {
        const validNumberOfCategories = Array(component.minCategories)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            name: `Category ${index + 1}`,
          }));

        component.onCategoriesChange(validNumberOfCategories);

        const categoriesArray = component.articleForm.get("categories");
        expect(categoriesArray?.errors).toBeNull();
      });
    });
  });
});
