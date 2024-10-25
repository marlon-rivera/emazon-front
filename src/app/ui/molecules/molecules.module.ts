import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComboboxComponent } from "./combobox/combobox.component";
import { ComboboxMultipleComponent } from "./combobox-multiple/combobox-multiple.component";
import { FormFieldComponent } from "./form-field/form-field.component";
import { ReactiveFormsModule } from "@angular/forms";
import { LabelComponent } from "../atoms/label/label.component";
import { InputFieldComponent } from "../atoms/input-field/input-field.component";
import { AtomsModule } from "../atoms/atoms.module";

@NgModule({
  declarations: [
    ComboboxMultipleComponent,
    FormFieldComponent,
    ComboboxComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, AtomsModule],
  exports: [ComboboxMultipleComponent, FormFieldComponent, ComboboxComponent],
})
export class MoleculesModule {}
