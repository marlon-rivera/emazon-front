import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ControlPanelPageComponent } from './control-panel-page.component';
import { ControlPanelModule } from '../control-panel.module';

describe('ControlPanelPageComponent', () => {
  let component: ControlPanelPageComponent;
  let fixture: ComponentFixture<ControlPanelPageComponent>;

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
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/categories']);
    });

    it('should navigate to brands when handleClickBrands is called', () => {
      component.handleClickBrands();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/brands']);
    });

    it('should navigate to articles when handleClickArticles is called', () => {
      component.handleClickArticles();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles']);
    });
    it('should navigate to articles when handleClickWarehouseAssistant is called', () => {
      component.handleClickWarehouseAssistant();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/warehouse-assistant']);
    });
  });
});