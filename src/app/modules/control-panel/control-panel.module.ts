import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlPanelPageComponent } from "./control-panel-page/control-panel-page.component";
import { UiModule } from "@/app/ui/ui.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    ControlPanelPageComponent,
  ],
  imports: [
    CommonModule,
    UiModule,
    RouterModule
  ],
  exports: [],
})
export class ControlPanelModule {}
