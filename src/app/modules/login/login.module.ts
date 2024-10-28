import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { UiModule } from 'src/app/ui/ui.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    UiModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class LoginModule { }
