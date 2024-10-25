import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./button/button.component";
import { InputFieldComponent } from "./input-field/input-field.component";
import { LabelComponent } from "./label/label.component";
import { LogoComponent } from "./logo/logo.component";
import { NotificationComponent } from "./notification/notification.component";

@NgModule({
  declarations: [
    ButtonComponent,
    InputFieldComponent,
    LabelComponent,
    LogoComponent,
    NotificationComponent,
  ],
  imports: [CommonModule],
  exports: [
    ButtonComponent,
    InputFieldComponent,
    LabelComponent,
    LogoComponent,
    NotificationComponent,
  ],
})
export class AtomsModule {}
