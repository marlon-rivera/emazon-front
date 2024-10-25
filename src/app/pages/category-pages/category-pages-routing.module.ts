import { CategoriesPanelPageComponent } from '@/app/modules/category/categories-panel-page/categories-panel-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPanelPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryPagesRoutingModule { }
