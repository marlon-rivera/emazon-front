import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from '@/app/modules/user/user.module';
import { UserPagesRoutingModule } from './user-pages-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserModule,
    UserPagesRoutingModule
  ]
})
export class UserPagesModule { }
