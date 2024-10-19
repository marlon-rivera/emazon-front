import { Component, HostListener, OnInit } from "@angular/core";
import {
  SIZE_PHONE,
  SIZE_HEIGHT_LOGO_DESKTOP_HEADER,
  SIZE_HEIGHT_LOGO_PHONE_HEADER,
  SIZE_WIDTH_LOGO_DESKTOP_HEADER,
  SIZE_WIDTH_LOGO_PHONE_HEADER,
  EMPTY
} from "@/app/utils/api.constants";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  sizeHeightLogo!: number;
  sizeWidthtLogo!: number;
  isMobile: boolean = false;
  productSearched: string = EMPTY;
  isLogged: boolean = false;

  constructor(readonly authService: AuthService) {}

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.isMobile = window.innerWidth < SIZE_PHONE;
    if (this.isMobile) {
      this.sizeHeightLogo = SIZE_HEIGHT_LOGO_PHONE_HEADER;
      this.sizeWidthtLogo = SIZE_WIDTH_LOGO_PHONE_HEADER;
    } else {
      this.sizeHeightLogo = SIZE_HEIGHT_LOGO_DESKTOP_HEADER;
      this.sizeWidthtLogo = SIZE_WIDTH_LOGO_DESKTOP_HEADER;
    }
  }

  ngOnInit() {
    this.onResize();
    this.authService.isLoggedIn.subscribe(loggedIn => {
      this.isLogged = loggedIn;
    });

    this.isLogged = this.authService.checkAuthentication();
  }

}
