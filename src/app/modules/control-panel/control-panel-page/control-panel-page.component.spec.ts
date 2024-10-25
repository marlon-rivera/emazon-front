import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ControlPanelPageComponent } from './control-panel-page.component';
import { ControlPanelModule } from '../control-panel.module';

describe('ControlPanelPageComponent', () => {
  let component: ControlPanelPageComponent;
  let fixture: ComponentFixture<ControlPanelPageComponent>;
  let router: Router;

  const mockRouter = {
    navigate: jest.fn(),
    url: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlPanelPageComponent],
      imports: [ControlPanelModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlPanelPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation methods', () => {
    it('should navigate to categories when handleClickCategories is called', () => {
      component.handleClickCategories();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/control-panel/categories']);
    });

    it('should navigate to brands when handleClickBrands is called', () => {
      component.handleClickBrands();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/control-panel/brands']);
    });

    it('should navigate to articles when handleClickArticles is called', () => {
      component.handleClickArticles();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/control-panel/articles']);
    });
  });

  describe('shouldHideButtons', () => {
    it('should return true when current route includes /categories', () => {
      mockRouter.url = '/control-panel/categories';
      expect(component.shouldHideButtons()).toBeTruthy();
    });

    it('should return true when current route includes /brands', () => {
      mockRouter.url = '/control-panel/brands';
      expect(component.shouldHideButtons()).toBeTruthy();
    });

    it('should return true when current route includes /articles', () => {
      mockRouter.url = '/control-panel/articles';
      expect(component.shouldHideButtons()).toBeTruthy();
    });

    it('should return false when current route does not include categories, brands, or articles', () => {
      mockRouter.url = '/control-panel';
      expect(component.shouldHideButtons()).toBeFalsy();
    });
  });
});