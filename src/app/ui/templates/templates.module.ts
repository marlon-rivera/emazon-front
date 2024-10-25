import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout/layout.component";
import { OrganismsModule } from "../organisms/organisms.module";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [LayoutComponent],
  imports: [OrganismsModule, CommonModule, RouterModule], 
  exports: [LayoutComponent],
})
export class TemplatesModule {}
