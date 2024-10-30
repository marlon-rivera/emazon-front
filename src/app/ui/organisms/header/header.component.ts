import { Component, OnInit } from "@angular/core";
import { EMPTY } from "@/app/shared/utils/api.constants";
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

  constructor(readonly authService: AuthService, readonly router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.username = this.authService.infoToken!.name;
      }
      this.isLogged = loggedIn;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
