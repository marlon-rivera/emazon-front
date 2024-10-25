import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryPagesRoutingModule } from './category-pages-routing.module';
import { CategoryModule } from '@/app/modules/category/category.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoryModule,
    CategoryPagesRoutingModule
  ]
})
export class CategoryPagesModule { }
