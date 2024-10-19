import { ASC_ORDER, DESC_ORDER, DESCRIPTION_BRAND, INITIAL_PAGE, MAX_VISIBLE_PAGES, NAME_BRAND, NAME_CATEGORY, SIZE_PAGE } from '@/app/utils/api.constants';
import { Brand } from '@/app/interfaces/brandinterface';
import { PaginationInfo } from '@/app/interfaces/pagination-info.interface';
import { BrandService } from 'src/app/services/brand.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brands-panel-page',
  templateUrl: './brands-panel-page.component.html',
  styleUrls: ['./brands-panel-page.component.scss']
})
export class BrandsPanelPageComponent {

  headers = [
    {name: NAME_BRAND, sortable: true},
    {name: DESCRIPTION_BRAND, sortable: false}
  ];
  rows!: any[];
  paginationInfo!: PaginationInfo<Brand>;
  currentPage = INITIAL_PAGE;
  maxVisiblePages = MAX_VISIBLE_PAGES;
  currentSortOrder: {[key: string]: string} = {[NAME_BRAND]: ASC_ORDER};

  constructor(readonly brandService: BrandService) { };

  ngOnInit(): void {
    this.getBrands(this.currentPage);
  }

  getBrands(page: number): void{
    const sortOrder = this.currentSortOrder[NAME_CATEGORY];
    this.brandService.getBrands(page, SIZE_PAGE,sortOrder)
      .subscribe(response => {
        this.paginationInfo = response.paginationInfo;
        this.rows = this.paginationInfo.list.map(brand => [
          brand.name,
          brand.description
        ])
      })
  }

  onSortChange(headerName: string): void {
    const currentOrder = this.currentSortOrder[headerName];
    this.currentSortOrder[headerName] = currentOrder === ASC_ORDER ? DESC_ORDER : ASC_ORDER;
    this.getBrands(this.currentPage);
  }

  onPageChange(page: number): void{
    this.currentPage = page;
    this.getBrands(page);
  }

}
