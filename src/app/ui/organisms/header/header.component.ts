import { Component, OnInit } from "@angular/core";
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  EMPTY,
  WAREHOUSE_ROLE,
} from "@/app/shared/utils/api.constants";
import { AuthService } from "@/app/shared/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  sizeHeightLogo!: number;
  sizeWidthtLogo!: number;
  productSearched: string = EMPTY;
  isLogged: boolean = false;
  username: string | undefined = "";
  menuItems: { name: string; route: string }[] = [];
  isMenuOpen = false;

  constructor(readonly authService: AuthService, readonly router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.username = this.authService.infoToken!.name;
        if (this.authService.infoToken!.role === ADMIN_ROLE) {
          this.menuItems = [
            { name: "Inicio", route: "/" },
            { name: "Panel de control", route: "/control-panel" },
            { name: "Marcas", route: "/brands" },
            { name: "Categorias", route: "/categories" },
            { name: "Articulos", route: "/articles" },
            { name: "Asis Bodega", route: "/warehouse-assistant" },
          ];
        } else if (this.authService.infoToken!.role === CLIENT_ROLE) {
          this.menuItems = [
            { name: "Inicio", route: "/" },
            { name: "Marcas", route: "/brands" },
            { name: "Categorias", route: "/categories" },
            { name: "Articulos", route: "/articles/list" },
            { name: "Carrito de compras", route: "/shopping-cart",
            },
          ];
        }else if(this.authService.infoToken!.role === WAREHOUSE_ROLE){
          this.menuItems = [
            { name: "Inicio", route: "/" },
            { name: "Marcas", route: "/brands" },
            { name: "Categorias", route: "/categories" },
            { name: "Articulos", route: "/articles/list" },
          ];
        }
      }
      this.isLogged = loggedIn;
    });
  }

  navigate(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("header__mobile-menu")) {
      this.isMenuOpen = false;
    }
  }
}
