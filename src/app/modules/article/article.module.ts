import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@/app/ui/ui.module';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ListArticlesPageComponent } from './list-articles-page/list-articles-page.component';

@NgModule({
  declarations: [
    CreateArticleComponent,
    ArticleCardComponent,
    ListArticlesPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule
  ],
  exports: [],
  
})
export class ArticleModule { }
