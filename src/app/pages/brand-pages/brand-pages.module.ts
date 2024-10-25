import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandPagesRoutingModule } from './brand-pages-routing.module';
import { BrandModule } from '@/app/modules/brand/brand.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrandModule,
    BrandPagesRoutingModule
  ]
})
export class BrandPagesModule { }
