import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./components/organisms/footer/footer.component";
import { LogoComponent } from "./components/atoms/logo/logo.component";
import { HeaderComponent } from "./components/organisms/header/header.component";
import { InputFieldComponent } from "./components/atoms/input-field/input-field.component";
import { ReactiveFormsModule } from "@angular/forms";
import { LabelComponent } from "./components/atoms/label/label.component";
import { FormFieldComponent } from "./components/molecules/form-field/form-field.component";
import { CreateCategoryComponent } from "./components/organisms/create-category/create-category.component";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./components/atoms/button/button.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./../core/interceptors/token.interceptor";
import { LoginComponent } from './components/organisms/login/login.component';
import { TitleParagraphTemplateComponent } from './components/templates/title-paragraph-template/title-paragraph-template.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { CategoriesPanelPageComponent } from './components/pages/categories-panel-page/categories-panel-page.component';
import { ControlPanelPageComponent } from './components/pages/control-panel-page/control-panel-page.component';
import { DynamicTableComponent } from './components/organisms/dynamic-table/dynamic-table.component';
import { HttpClientModule } from '@angular/common/http';
import { NotificationComponent } from './components/atoms/notification/notification.component';
import { BrandsPanelPageComponent } from './components/pages/brands-panel-page/brands-panel-page.component';
import { CreateBrandComponent } from './components/organisms/create-brand/create-brand.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LogoComponent,
    HeaderComponent,
    InputFieldComponent,
    LabelComponent,
    FormFieldComponent,
    CreateCategoryComponent,
    ButtonComponent,
    LoginComponent,
    TitleParagraphTemplateComponent,
    HomePageComponent,
    CategoriesPanelPageComponent,
    ControlPanelPageComponent,
    DynamicTableComponent,
    NotificationComponent,
    BrandsPanelPageComponent,
    CreateBrandComponent,
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
