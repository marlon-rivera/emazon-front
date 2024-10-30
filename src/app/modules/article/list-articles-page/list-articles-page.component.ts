import { Component, OnInit, HostListener } from "@angular/core";
import { Article } from "@/app/shared/interfaces/article.interface";
import { ArticleService } from "@/app/shared/services/article.service";
import { PaginationInfo } from "@/app/shared/interfaces/pagination-info.interface";
import { Option } from "@/app/shared/interfaces/option.interface";
import {
  ASC_ORDER,
  CRITERIA_ARTICLE_NAME,
  INITIAL_PAGE,
  MAX_VISIBLE_PAGES,
  SIZE_PAGE,
  EMPTY,
  NOTIFICATION_TYPE,
  NotificationType
} from "@/app/shared/utils/api.constants";
import { Category } from "@/app/shared/interfaces/category.interface";
import { CategoryService } from "@/app/shared/services/category.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { SupplyService } from "@/app/shared/services/supply.service";
import { AddSuply } from "@/app/shared/interfaces/supply.interface";

@Component({
  selector: "app-list-articles-page",
  templateUrl: "./list-articles-page.component.html",
  styleUrls: ["./list-articles-page.component.scss"],
})
export class ListArticlesPageComponent implements OnInit {
  articles!: Article[];
  categories!: Option[];
  categoriesSelected: number[] = [];
  paginationInfo: PaginationInfo<Article> = {
    list: [],
    totalPages: 0,
    currentPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: 0,
    totalElements: 0,
  };
  maxVisiblePages = MAX_VISIBLE_PAGES;
  currentPage = INITIAL_PAGE;
  isCategoriesVisible = false;
  isMobile = false;
  order = ASC_ORDER;
  orderControl!: FormControl;
  criteriaControl!: FormControl;
  showModal: boolean = false;
  selectedArticle!: Article | null;
  quantityToAdd: FormControl = new FormControl(0, [
    Validators.required,
    Validators.min(1),
    Validators.pattern("^[0-9]*$"),
  ]);
  notificationMessage: string = EMPTY;
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;
  showNotification: boolean = false;

  constructor(
    readonly articleService: ArticleService,
    readonly caetgoryService: CategoryService,
    readonly supplyService: SupplyService,
    readonly builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.orderControl = new FormControl(ASC_ORDER);
    this.criteriaControl = new FormControl(CRITERIA_ARTICLE_NAME);
    this.getArticles();
    this.caetgoryService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    });

  }

  toggleCategories(): void {
    this.isCategoriesVisible = !this.isCategoriesVisible;
  }

  getArticles(): void {
    this.articleService
      .getArticles(
        this.currentPage,
        SIZE_PAGE,
        this.categoriesSelected,
        this.orderControl.value,
        this.criteriaControl.value
      )
      .subscribe((response) => {
        this.articles = response.paginationInfo.list;
        this.paginationInfo = response.paginationInfo;
      });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.paginationInfo.totalPages) {
      this.currentPage = page;
      this.getArticles();
    }
  }

  onCategorySelected(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.categoriesSelected.push(Number(checkbox.value));
    } else {
      this.categoriesSelected = this.categoriesSelected.filter(
        (c) => c !== Number(checkbox.value)
      );
    }
    this.getArticles();
  }

  onChangeOrder(event: Option | null): void {
    if (event) {
      this.orderControl.setValue(event.name);
    }
  }

  onChangeCriteria(event: Option | null): void {
    if (event) {
      this.criteriaControl.setValue(event.name);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const halfWindow = Math.floor(this.maxVisiblePages / 2);

    const totalPages = this.paginationInfo.totalPages;
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

  onOpenModal(event: Article) {
    this.selectedArticle = event;
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
    this.quantityToAdd.setValue(0);
    this.selectedArticle = null;
  }

  onChangeQuantityToAdd(event: string): void {
    this.quantityToAdd.setValue(event);
  }

  onSumbitQuantityToAdd(): void {
    if(this.quantityToAdd.valid){
      const addSupply: AddSuply = {
        idArticle: this.selectedArticle!.id,
        quantity: this.quantityToAdd.value
      }
      this.supplyService.addSupply(addSupply).subscribe({
        next: () => {
          this.showNotification = true;
          this.notificationMessage = "Suministro agregado correctamente.";
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.quantityToAdd.reset();
          this.autoHideNotification();
          this.getArticles();
        },
        error: (err) => {
          this.showNotification = true;
          this.notificationMessage = err.error.message;
          this.notificationType = NOTIFICATION_TYPE.ERROR;
        }
      })
    }
  }

  private autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}
