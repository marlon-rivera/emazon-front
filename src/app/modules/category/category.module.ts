import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiModule } from "@/app/ui/ui.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CreateCategoryComponent } from "./create-category/create-category.component";
import { CategoriesPanelPageComponent } from "./categories-panel-page/categories-panel-page.component";

@NgModule({
  declarations: [CreateCategoryComponent, CategoriesPanelPageComponent],
  imports: [CommonModule, ReactiveFormsModule, UiModule],
  exports: [CategoriesPanelPageComponent]
})
export class CategoryModule {}
