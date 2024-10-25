import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthPagesRoutingModule } from './auth-pages-routing.module';
import { LoginModule } from '@/app/modules/login/login.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginModule,
    AuthPagesRoutingModule
  ]
})
export class AuthPagesModule { }
