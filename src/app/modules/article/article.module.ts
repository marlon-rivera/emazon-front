import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiModule } from '@/app/ui/ui.module';
import { CreateArticleComponent } from './create-article/create-article.component';
import { ArticleCardComponent } from './article-card/article-card.component';

@NgModule({
  declarations: [
    CreateArticleComponent,
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule
  ],
  exports: []
})
export class ArticleModule { }
