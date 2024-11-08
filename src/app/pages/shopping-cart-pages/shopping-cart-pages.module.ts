import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartPagesRoutingModule } from './shopping-cart-pages-routing.module';
import { ShoppingCartModule } from '@/app/modules/shopping-cart/shopping-cart.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShoppingCartModule,
    ShoppingCartPagesRoutingModule
  ]
})
export class ShoppingCartPagesModule { }
