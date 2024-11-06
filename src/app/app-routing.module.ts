import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./ui/templates/layout/layout.component";
import { TYPE_USER_WAREHOUSE_ASSISTANT } from "./shared/utils/api.constants";
import { AuthGuard } from "./shared/auth/guards/auth.guard";
import { AdminGuard } from "./shared/auth/guards/admin.guard";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("src/app/pages/home-pages/home-pages.module").then(
            (m) => m.HomePagesModule
          ),
      },
      {
        path: "auth",
        loadChildren: () =>
          import("src/app/pages/auth-pages/auth-pages.module").then(
            (m) => m.AuthPagesModule
          ),
      },
      {
        path: "control-panel",
        loadChildren: () =>
          import(
            "src/app/pages/control-panel-pages/control-panel-pages.module"
          ).then((m) => m.ControlPanelPagesModule),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "brands",
        loadChildren: () =>
          import("src/app/pages/brand-pages/brand-pages.module").then(
            (m) => m.BrandPagesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "categories",
        loadChildren: () =>
          import("src/app/pages/category-pages/category-pages.module").then(
            (m) => m.CategoryPagesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "articles",
        loadChildren: () =>
          import("src/app/pages/article-pages/article-pages.module").then(
            (m) => m.ArticlePagesModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "warehouse-assistant",
        loadChildren: () =>
          import(
            "src/app/pages/warehouse-assistant-pages/warehouse-assistant-pages.module"
          ).then((m) => m.WarehouseAssistantPagesModule),
        canActivate: [AuthGuard, AdminGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
