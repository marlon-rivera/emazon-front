import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "./atoms/button/button.component";
import { InputFieldComponent } from "./atoms/input-field/input-field.component";
import { LabelComponent } from "./atoms/label/label.component";
import { LogoComponent } from "./atoms/logo/logo.component";
import { NotificationComponent } from "./atoms/notification/notification.component";
import { ComboboxComponent } from "./molecules/combobox/combobox.component";
import { ComboboxMultipleComponent } from "./molecules/combobox-multiple/combobox-multiple.component";
import { FormFieldComponent } from "./molecules/form-field/form-field.component";
import { DynamicTableComponent } from "./organisms/dynamic-table/dynamic-table.component";
import { FooterComponent } from "./organisms/footer/footer.component";
import { HeaderComponent } from "./organisms/header/header.component";
import { LayoutComponent } from "./templates/layout/layout.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    InputFieldComponent,
    LabelComponent,
    LabelComponent,
    LogoComponent,
    NotificationComponent,
    ComboboxComponent,
    ComboboxMultipleComponent,
    FormFieldComponent,
    DynamicTableComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    ButtonComponent
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [
    InputFieldComponent,
    LabelComponent,
    LabelComponent,
    LogoComponent,
    NotificationComponent,
    ComboboxComponent,
    ComboboxMultipleComponent,
    FormFieldComponent,
    DynamicTableComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    ButtonComponent
  ],
})
export class UiModule {}
