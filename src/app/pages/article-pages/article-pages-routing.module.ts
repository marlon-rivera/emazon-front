import { CreateArticleComponent } from '@/app/modules/article/create-article/create-article.component';
import { ListArticlesPageComponent } from '@/app/modules/article/list-articles-page/list-articles-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CreateArticleComponent
  },
  {
    path: 'list',
    component: ListArticlesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlePagesRoutingModule { }
