import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UiModule } from 'src/app/ui/ui.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    UiModule,
    CommonModule,
  ]
})
export class LoginModule { }
