import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiModule } from '../ui/ui.module';
import { HomePageComponent } from '../modules/home/pages/home-page/home-page.component';
import { LoginComponent } from '../modules/login/login/login.component';
import { LoginModule } from '../modules/login/login.module';
import { ControlPanelPageComponent } from '../modules/control-panel/control-panel-page/control-panel-page.component';
import { ControlPanelModule } from '../modules/control-panel/control-panel.module';
import { BrandsPanelPageComponent } from '../modules/brand/brands-panel-page/brands-panel-page.component';
import { CategoriesPanelPageComponent } from '../modules/category/categories-panel-page/categories-panel-page.component';
import { ArticleModule } from '../modules/article/article.module';
import { CategoryModule } from '../modules/category/category.module';
import { BrandModule } from '../modules/brand/brand.module';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'control-panel', component: ControlPanelPageComponent, children: [
    {path: 'brands', component: BrandsPanelPageComponent},
    {path: 'categories', component: CategoriesPanelPageComponent}
  ]}
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UiModule,
    LoginModule,
    ControlPanelModule,
    ArticleModule,
    CategoryModule,
    BrandModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesModule { }
