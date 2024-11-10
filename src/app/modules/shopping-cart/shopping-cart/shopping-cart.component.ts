import { Brand } from "@/app/shared/interfaces/brandinterface";
import { Category } from "@/app/shared/interfaces/category.interface";
import { Option } from "@/app/shared/interfaces/option.interface";
import { ArticlesShoppinCart } from "@/app/shared/interfaces/shopping-cart.interface";
import { BrandService } from "@/app/shared/services/brand.service";
import { CategoryService } from "@/app/shared/services/category.service";
import { ShoppingCartService } from "@/app/shared/services/shopping-cart.service";
import {
  ASC_ORDER,
  DESC_ORDER,
  EMPTY,
  INITIAL_PAGE,
  MAX_VISIBLE_PAGES,
  NOTIFICATION_TYPE,
  NotificationType,
} from "@/app/shared/utils/api.constants";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.scss"],
})
export class ShoppingCartComponent implements OnInit {
  articlesShoppingCart: ArticlesShoppinCart = {
    totalPrice: 0,
    articles: {
      list: [],
      totalPages: 0,
      currentPage: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      pageSize: 0,
      totalElements: 0,
    },
    modificationDate: null,
  };
  categories: Option[] = [];
  brands: Option[] = [];
  maxVisiblePages = MAX_VISIBLE_PAGES;
  currentPage = INITIAL_PAGE;
  categoriesSelected: Option[] = [];
  brandsSelected: Option[] = [];
  isCategoriesVisible = false;
  isBrandsVisible = false;
  order: "Ascendentemente" | "Descendentemente" = "Ascendentemente";
  showNotification: boolean = false;
  notificationMessage: string = EMPTY;
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;

  constructor(
    readonly shoppingCartService: ShoppingCartService,
    readonly categoryService: CategoryService,
    readonly brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.getArticlesFromShoppingCart();
    this.categoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    });
    this.brandService.getAllBrands().subscribe((data: Brand[]) => {
      this.brands = data.map((brand) => ({
        id: brand.id,
        name: brand.name,
      }));
    });
  }

  getArticlesFromShoppingCart(): void {
    const orderName = this.order == "Ascendentemente" ? ASC_ORDER : DESC_ORDER;
    this.shoppingCartService
      .getArticlesFromShoppingCart(
        this.currentPage,
        4,
        orderName,
        this.categoriesSelected.flatMap((c) => c.id),
        this.brandsSelected.flatMap((b) => b.id)
      )
      .subscribe((response) => {
        this.articlesShoppingCart = response;
      });
  }

  onCategorySelected(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const id = button.getAttribute("data-id");
    const name = button.getAttribute("data-name");
    if (id && name) {
      const checkbox = document.getElementById("C" + id) as HTMLInputElement;

      if (checkbox.checked) {
        const alreadySelected = this.categoriesSelected.find(
          (category) => category.id === Number(id)
        );

        if (!alreadySelected) {
          this.categoriesSelected.push({ id: Number(id), name: name });
        } else {
          checkbox.checked = false;
          this.categoriesSelected = this.categoriesSelected.filter(
            (category) => category.id !== Number(id)
          );
        }
      }else{
        this.categoriesSelected = this.categoriesSelected.filter(
          (category) => category.id !== Number(id)
        );
      }
    }
    this.getArticlesFromShoppingCart();
  }

  onBrandSelected(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const id = button.getAttribute("data-id");
    const name = button.getAttribute("data-name");
    if (id && name) {
      const checkbox = document.getElementById("B" + id) as HTMLInputElement;

      if (checkbox.checked) {
        const alreadySelected = this.brandsSelected.find(
          (brand) => brand.id === Number(id)
        );

        if (!alreadySelected) {
          this.brandsSelected.push({ id: Number(id), name: name });
        } else {
          checkbox.checked = false;
          this.brandsSelected = this.brandsSelected.filter(
            (brand) => brand.id !== Number(id)
          );
        }
      }else{
        this.brandsSelected = this.brandsSelected.filter(
          (brand) => brand.id !== Number(id)
        );
      }
    }
    this.getArticlesFromShoppingCart();
  }

  changeOrder(): void {
    if (this.order === "Ascendentemente") {
      this.order = "Descendentemente";
    } else {
      this.order = "Ascendentemente";
    }
    this.getArticlesFromShoppingCart();
  }

  toString(number: number): string {
    return String(number);
  }

  quantityChange(idArticle: number, value: string): void {
    const numberValue = Number(value);

    const article = this.articlesShoppingCart.articles.list.find(
      (a) => a.id === idArticle
    );
    if (article) {
      if (numberValue < 1) {
        article.quantityRequired = 1;
      } else if (numberValue > article.quantity) {
        article.quantityRequired = article.quantity;
      } else {
        article.quantityRequired = numberValue;
      }
      this.shoppingCartService
        .addToShoppingCart({
          idArticle: article.id,
          quantity: article.quantityRequired,
        })
        .subscribe({
          next: () => {
            this.getArticlesFromShoppingCart();
          },
          error: (err) => {
            this.getArticlesFromShoppingCart();
          },
        });
    }
  }

  deleteArticle(idArticle: number): void {
    this.shoppingCartService
      .deleteArticleFromShoppingCart(idArticle)
      .subscribe({
        next: () => {
          this.notificationMessage = "Borrado exitosamente.";
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.showNotification = true;
          this.autoHideNotification();
          this.getArticlesFromShoppingCart();
        },
        error: (err) => {
          this.notificationMessage = "Borrado exitosamente.";
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.showNotification = true;
          this.autoHideNotification();
        },
      });
  }

  toggleCategories(): void {
    this.isCategoriesVisible = !this.isCategoriesVisible;
  }

  toggleBrands(): void {
    this.isBrandsVisible = !this.isBrandsVisible;
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.articlesShoppingCart.articles.totalPages) {
      this.currentPage = page;
      this.getArticlesFromShoppingCart();
    }
  }

  increaseQuantity(articleId: number) {
    const article = this.articlesShoppingCart.articles.list.find(
      (a) => a.id === articleId
    );
    if (article) {
      article.quantityRequired = (article.quantityRequired || 0) + 1;
      this.shoppingCartService
        .addToShoppingCart({
          idArticle: article.id,
          quantity: article.quantityRequired,
        })
        .subscribe({
          next: () => {
            this.getArticlesFromShoppingCart();
          },
          error: (err) => {
            this.getArticlesFromShoppingCart();
          },
        });
    }
  }

  decreaseQuantity(articleId: number) {
    const article = this.articlesShoppingCart.articles.list.find(
      (a) => a.id === articleId
    );
    if (article && article.quantityRequired > 1) {
      article.quantityRequired -= 1;
      this.shoppingCartService
        .addToShoppingCart({
          idArticle: article.id,
          quantity: article.quantityRequired,
        })
        .subscribe({
          next: () => {
            this.getArticlesFromShoppingCart();
          },
          error: (err) => {
            this.getArticlesFromShoppingCart();
          },
        });
    }
  }
  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const halfWindow = Math.floor(this.maxVisiblePages / 2);

    const totalPages = this.articlesShoppingCart.articles.totalPages;
    const maxVisible = Math.min(totalPages, this.maxVisiblePages);

    let start = Math.max(0, this.currentPage - halfWindow);
    let end = Math.min(totalPages, this.currentPage + halfWindow + 1);

    if (totalPages <= maxVisible) {
      start = 0;
      end = totalPages;
    } else if (this.currentPage <= halfWindow) {
      start = 0;
      end = maxVisible;
    } else if (this.currentPage + halfWindow >= totalPages) {
      start = totalPages - maxVisible;
      end = totalPages;
    }

    for (let i = start; i < end; i++) {
      visiblePages.push(i);
    }

    if (start > 0) {
      visiblePages.unshift(-1);
      visiblePages.unshift(0);
    }

    if (end < totalPages) {
      visiblePages.push(-1);
      visiblePages.push(totalPages - 1);
    }

    return visiblePages;
  }

  private autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
