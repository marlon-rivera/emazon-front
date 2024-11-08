import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { UiModule } from "../../ui/ui.module";
import { AtomsModule } from "../../ui/atoms/atoms.module";

@NgModule({
  declarations: [ShoppingCartComponent],
  imports: [CommonModule, UiModule],
})
export class ShoppingCartModule {}
