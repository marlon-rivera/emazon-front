import { Component } from "@angular/core";
import { CategoryService } from "src/app/services/category.service";
import {
  PaginationInfo,
} from "@/app/interfaces/pagination-info.interface";
import { Category } from "@/app/interfaces/category.interface";
import {
  ASC_ORDER,
  DESC_ORDER,
  DESCRIPTION_CATEGORY,
  INITIAL_PAGE,
  MAX_VISIBLE_PAGES,
  NAME_CATEGORY,
  SIZE_PAGE,
} from "@/app/utils/api.constants";
@Component({
  selector: 'app-categories-panel-page',
  templateUrl: './categories-panel-page.component.html',
  styleUrls: ['./categories-panel-page.component.scss']
})
export class CategoriesPanelPageComponent {
  headers = [
    { name: NAME_CATEGORY, sortable: true },
    { name: DESCRIPTION_CATEGORY, sortable: false }
  ];
  rows!: any[];
  paginationInfo!: PaginationInfo<Category>;
  currentPage = INITIAL_PAGE;
  maxVisiblePages = MAX_VISIBLE_PAGES;
  currentSortOrder: { [key: string]: string } = { [NAME_CATEGORY]: ASC_ORDER };

  constructor(readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategories(this.currentPage);
  }

  getCategories(page: number): void {
    const sortOrder = this.currentSortOrder[NAME_CATEGORY];
    this.categoryService.getCategories(page, SIZE_PAGE, sortOrder)
      .subscribe(response => {
        this.paginationInfo = response.paginationInfo;
        this.rows = this.paginationInfo.list.map(category => [
          category.name,
          category.description
        ]);
      });
  }

  onSortChange(headerName: string): void {
    const currentOrder = this.currentSortOrder[headerName];
    this.currentSortOrder[headerName] = currentOrder === ASC_ORDER ? DESC_ORDER : ASC_ORDER;
    this.getCategories(this.currentPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getCategories(page);
  }
}
