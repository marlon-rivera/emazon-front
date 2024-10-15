import { PaginationInfo } from '@/core/interfaces/pagination-info.interface';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent{
  @Input() headers!: { name: string; sortable: boolean }[];
  @Input() rows!: any[];
  @Input() currentSortOrder!: { [key: string]: string };
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Input() maxVisiblePages!: number;
  @Input() paginationInfo!: PaginationInfo<any>;


  @Output() sortChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  toggleSort(headerName: string): void {
    this.sortChange.emit(headerName);
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const halfWindow = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(0, this.currentPage - halfWindow);
    let end = Math.min(this.totalPages, this.currentPage + halfWindow + 1);

    if (this.currentPage <= halfWindow) {
      start = 0;
      end = this.maxVisiblePages;
    } else if (this.currentPage + halfWindow >= this.totalPages) {
      start = this.totalPages - this.maxVisiblePages;
      end = this.totalPages;
    }

    for (let i = start; i < end; i++) {
      visiblePages.push(i);
    }

    if (start > 0) {
      visiblePages.unshift(-1);
      visiblePages.unshift(0);
    }

    if (end < this.totalPages) {
      visiblePages.push(-1);
      visiblePages.push(this.totalPages - 1);
    }

    return visiblePages;
  }
}
