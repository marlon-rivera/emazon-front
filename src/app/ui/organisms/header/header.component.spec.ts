import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '@/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ADMIN_ROLE, CLIENT_ROLE, WAREHOUSE_ROLE } from '@/app/shared/utils/api.constants';
import { UiModule } from '../../ui.module';
import { MoleculesModule } from '../../molecules/molecules.module';
import { AtomsModule } from '../../atoms/atoms.module';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: of(false),
      infoToken: { name: '' },
      logout: jest.fn()
    } as unknown as jest.Mocked<AuthService>;
    
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [MoleculesModule, AtomsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize authentication state and username on init', () => {
    authServiceMock.isLoggedIn = of(true);
    authServiceMock.infoToken!.name = 'John Doe';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLogged).toBe(true);
    expect(component.username).toBe('John Doe');
  });

  it('should set isLogged to false and username to empty if user is not authenticated', () => {
    authServiceMock.isLoggedIn = of(false);
    authServiceMock.infoToken!.name = '';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLogged).toBe(false);
    expect(component.username).toBe('');
  });

  it('should call logout and redirect to home page when logging out', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set menu items based on user role - Admin', () => {
    authServiceMock.isLoggedIn = of(true);
    authServiceMock.infoToken!.role = ADMIN_ROLE;
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.menuItems.length).toBe(6);
    expect(component.menuItems[0].name).toBe('Inicio');
    expect(component.menuItems[1].name).toBe('Panel de control');
    expect(component.menuItems[2].name).toBe('Marcas');
    expect(component.menuItems[3].name).toBe('Categorias');
    expect(component.menuItems[4].name).toBe('Articulos');
    expect(component.menuItems[5].name).toBe('Asis Bodega');
  });
  
  it('should set menu items based on user role - Client', () => {
    authServiceMock.isLoggedIn = of(true);
    authServiceMock.infoToken!.role = CLIENT_ROLE;
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.menuItems.length).toBe(5);
    expect(component.menuItems[4].name).toBe('Carrito de compras');
  });
  
  it('should set menu items based on user role - Warehouse Assistant', () => {
    authServiceMock.isLoggedIn = of(true);
    authServiceMock.infoToken!.role = WAREHOUSE_ROLE;
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.menuItems.length).toBe(4);
    expect(component.menuItems[3].name).toBe('Articulos');
  });
  
  it('should navigate to the correct route when clicking on a menu item', () => {
    const route = '/brands';
    component.navigate(route);
    expect(routerMock.navigate).toHaveBeenCalledWith([route]);
    expect(component.isMenuOpen).toBe(false);
  });
  
  it('should toggle the menu open and close', () => {
    expect(component.isMenuOpen).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpen).toBe(false);
  });
  
  it('should close the menu when clicking outside of the menu', () => {
    const eventMock = { target: { classList: { contains: jest.fn(() => true) } } } as unknown as MouseEvent;
    component.closeMenuOutside(eventMock);
    expect(component.isMenuOpen).toBe(false);
  });
  
});