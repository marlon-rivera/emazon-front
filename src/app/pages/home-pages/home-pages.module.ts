import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePagesRoutingModule } from './home-pages-routing.module';
import { HomeModule } from '@/app/modules/home/home.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    HomePagesRoutingModule
  ]
})
export class HomePagesModule { }
