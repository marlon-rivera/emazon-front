import { CreateArticleComponent } from "@/app/modules/article/create-article/create-article.component";
import { ControlPanelPageComponent } from "@/app/modules/control-panel/control-panel-page/control-panel-page.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: ControlPanelPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelPagesRoutingModule {}
