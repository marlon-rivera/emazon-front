import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlePagesRoutingModule } from './article-pages-routing.module';
import { ArticleModule } from '@/app/modules/article/article.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ArticleModule,
    ArticlePagesRoutingModule
  ]
})
export class ArticlePagesModule { }
