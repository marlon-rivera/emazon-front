import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleCardComponent } from './article-card.component';
import { AuthService } from '@/app/shared/services/auth.service';
import { Article } from '@/app/shared/interfaces/article.interface';
import { WAREHOUSE_ROLE } from '@/app/shared/utils/api.constants';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ArticleCardComponent', () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;
  let authServiceMock: Partial<AuthService>;

  const mockArticle: Article = {
    id: 1,
    name: 'Test Article',
    description: 'Test Description',
    brand: {id: 1, name: 'Test bran', description: 'Test description'},
    categories: [{
      id: 1, name: 'Test category', description: 'Test description'
    }],
    price: 10000,
    quantity: 10
  };

  beforeEach(async () => {
    authServiceMock = {
      infoToken: { role: WAREHOUSE_ROLE, name: 'Test', email: 'test@test.com', exp: 10002, iat: 10000, sub: '1' },
    };

    await TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.article = mockArticle;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set warehouseAssistant to true if user role is WAREHOUSE_ROLE', () => {
    component.ngOnInit();
    expect(component.warehouseAssistant).toBe(true);
  });

  it('should set warehouseAssistant to false if user role is not WAREHOUSE_ROLE', () => {
    authServiceMock.infoToken!.role = 'OTHER_ROLE';
    component.ngOnInit();
    expect(component.warehouseAssistant).toBe(false);
  });

  it('should emit openModal event with the article when onOpenModal is called', () => {
    const emitSpy = jest.spyOn(component.openModal, 'emit');
    component.onOpenModal();
    expect(emitSpy).toHaveBeenCalledWith(mockArticle);
  });
});
