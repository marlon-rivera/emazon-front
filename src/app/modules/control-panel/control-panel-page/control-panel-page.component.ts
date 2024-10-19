import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-control-panel-page",
  templateUrl: "./control-panel-page.component.html",
  styleUrls: ["./control-panel-page.component.scss"],
})
export class ControlPanelPageComponent {
  constructor(readonly router: Router) {}

  handleClickCategories(): void {
    this.router.navigate(["/control-panel/categories"]);
  }

  handleClickBrands(): void {
    this.router.navigate(["/control-panel/brands"]);
  }

  handleClickArticles(): void {
    this.router.navigate(["/control-panel/articles"]);
  }

  shouldHideButtons(): boolean {
    const currentRoute = this.router.url;
    return (
      currentRoute.includes("/categories") ||
      currentRoute.includes("/brands") ||
      currentRoute.includes("/articles")
    );
  }
}
