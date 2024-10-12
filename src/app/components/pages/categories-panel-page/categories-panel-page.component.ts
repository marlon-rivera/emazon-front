import { Component } from "@angular/core";
import { CategoryService } from "src/core/services/category.service";
import {
  PaginationInfoResponse,
  PaginationInfo,
} from "src/core/interfaces/pagination-info.interface";
import { Category } from "src/core/interfaces/category.interface";
import {
  ASC_ORDER,
  DESC_ORDER,
  DESCRIPTION_CATEGORY,
  INITIAL_PAGE,
  NAME_CATEGORY,
  SIZE_PAGE,
} from "src/core/constants/api.constants";

@Component({
  selector: "app-categories-panel-page",
  templateUrl: "./categories-panel-page.component.html",
  styleUrls: ["./categories-panel-page.component.scss"],
})
export class CategoriesPanelPageComponent {
  headers: { name: string; sortable: boolean }[] = [
    { name: NAME_CATEGORY, sortable: true },
    { name: DESCRIPTION_CATEGORY, sortable: false },
  ];
  rows!: any[];
  paginationInfo!: PaginationInfo<Category>;
  currentPage: number = INITIAL_PAGE;
  currentSortOrder: { [key: string]: string } = { [NAME_CATEGORY]: ASC_ORDER };
  maxVisiblePages: number = 5;

  constructor(readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories(this.currentPage);
  }

  getCategories(page: number): void {
    const sortOrder = this.currentSortOrder[NAME_CATEGORY];
    this.categoryService
      .getCategories(page, SIZE_PAGE, sortOrder)
      .subscribe((response: PaginationInfoResponse<Category>) => {
        this.paginationInfo = response.paginationInfo;
        this.rows = this.paginationInfo.list.map((category) => [
          category.name,
          category.description,
        ]);
      });
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.paginationInfo.totalPages) {
      this.currentPage = page;
      this.getCategories(page);
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.paginationInfo.totalPages;
    const visiblePages: number[] = [];

    if (totalPages <= this.maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const halfWindow = Math.floor(this.maxVisiblePages / 2);
      let start = Math.max(0, this.currentPage - halfWindow);
      let end = Math.min(totalPages, this.currentPage + halfWindow + 1);

      if (this.currentPage <= halfWindow) {
        start = 0;
        end = this.maxVisiblePages;
      } else if (this.currentPage + halfWindow >= totalPages) {
        start = totalPages - this.maxVisiblePages;
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
    }

    return visiblePages;
  }

  toggleSort(headerName: string): void {
    const currentOrder = this.currentSortOrder[headerName];
    this.currentSortOrder[headerName] =
      currentOrder === ASC_ORDER ? DESC_ORDER : ASC_ORDER;
    this.getCategories(this.currentPage);
  }
}