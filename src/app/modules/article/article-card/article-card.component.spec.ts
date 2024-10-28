import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardComponent } from './article-card.component';
import { Article } from '@/app/shared/interfaces/article.interface';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
