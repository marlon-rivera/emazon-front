import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { ArticleService } from "@/app/shared/services/article.service";
import {
  EMPTY,
  MAX_CATEGORIES_BY_ARTICLE,
  MIN_CATEGORIES_BY_ARTICLE,
  NOTIFICATION_TYPE,
  NotificationType,
} from "@/app/shared/utils/api.constants";
import { Option } from "@/app/shared/interfaces/option.interface";
import { CategoryService } from "@/app/shared/services/category.service";
import { BrandService } from "@/app/shared/services/brand.service";
import { Category } from "@/app/shared/interfaces/category.interface";
import { Brand } from "@/app/shared/interfaces/brandinterface";
import { CreateArticle } from "@/app/shared/interfaces/article.interface";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-article",
  templateUrl: "./create-article.component.html",
  styleUrls: ["./create-article.component.scss"],
})
export class CreateArticleComponent implements OnInit {
  articleForm!: FormGroup;
  notificationMessage: string = EMPTY;
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;
  showNotification: boolean = false;

  categoryOptions: Option[] = [];
  selectedCategories: Option[] = [];
  selectedBrand = null;
  brandOptions: Option[] = [];
  maxCategories = MAX_CATEGORIES_BY_ARTICLE;
  minCategories = MIN_CATEGORIES_BY_ARTICLE;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly categoryService: CategoryService,
    readonly brandService: BrandService,
    readonly articleService: ArticleService,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categoryOptions = data.map(category => ({
        id: category.id,
        name: category.name
      }));
    });
    this.brandService.getAllBrands().subscribe((data: Brand[]) => {
      this.brandOptions = data.map(brand => ({
        id: brand.id,
        name: brand.name
      }))
    })
    this.articleForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      price: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      brand: ["", [Validators.required]],
      brandId: ["", [Validators.required]],
      categories: this.formBuilder.array([], [this.categoryValidator]),
    });
  }

  categoryValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: boolean } | null => {
    if (control instanceof FormArray) {
      const categoryCount = control.length;
      const isInvalid =
        categoryCount < this.minCategories ||
        categoryCount > this.maxCategories;
      return isInvalid ? { categoryCountInvalid: true } : null;
    }
    return null;
  };

  onCategoriesChange(event: any) {
    const selectedCategories = event as { id: number; name: string }[];
    const categoriesFormArray = this.articleForm.get("categories") as FormArray;
    categoriesFormArray.clear();
    selectedCategories.forEach((category) => {
      categoriesFormArray.push(this.formBuilder.control(category.id));
    });
  }

  onBrandSelect(event: Option | null) {
    const brandIdControl = this.articleForm.get("brandId");
    const brandControl = this.articleForm.get("brand");
  
    if (brandIdControl && brandControl) {
      if (event) {
        brandIdControl.setValue(event.id);
        brandControl.setValue(event.name);
      } else {
        brandIdControl.setValue(null);
        brandControl.setValue(null);
      }
    }
  }

  clearCategories() {
    const categoriesArray = this.articleForm.get('categories') as FormArray;
    categoriesArray.clear();
    this.selectedCategories = []
  }

  onSubmit() {
    if (this.articleForm.valid) {
      const createArticle: CreateArticle = {
        name: this.articleForm.get("name")!.value,
        description: this.articleForm.get("description")!.value,
        price: this.articleForm.get("price")!.value,
        quantity: this.articleForm.get("quantity")!.value,
        categoriesIds: this.articleForm.get("categories")!.value,
        brand: {
          id: this.articleForm.get("brandId")!.value,
          name: '',
          description: ''
        }
      }
      this.articleService.createArticle(createArticle).subscribe({
        next: () => {
          this.showNotification = true;
          this.notificationMessage = "Artículo creado con éxito";
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.articleForm.reset();
          this.clearCategories();
          this.autoHideNotification();
        },
        error: (err) => {
          this.showNotification = true;
          this.notificationMessage = err.error.message;
          this.notificationType = NOTIFICATION_TYPE.ERROR;
        }}
      )
    }
  }

  handleClickListArticles() : void {
    this.router.navigate(["/articles/list"])
  }

  private autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
