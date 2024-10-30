import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthPagesRoutingModule } from './auth-pages-routing.module';
import { LoginModule } from '@/app/modules/login/login.module';
import { ClientModule } from '@/app/modules/client/client.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginModule,
    ClientModule,
    AuthPagesRoutingModule
  ]
})
export class AuthPagesModule { }
