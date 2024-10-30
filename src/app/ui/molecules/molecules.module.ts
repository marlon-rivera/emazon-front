import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComboboxComponent } from "./combobox/combobox.component";
import { ComboboxMultipleComponent } from "./combobox-multiple/combobox-multiple.component";
import { FormFieldComponent } from "./form-field/form-field.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AtomsModule } from "../atoms/atoms.module";
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    ComboboxMultipleComponent,
    FormFieldComponent,
    ComboboxComponent,
    ModalComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, AtomsModule],
  exports: [ComboboxMultipleComponent, FormFieldComponent, ComboboxComponent, ModalComponent],
})
export class MoleculesModule {}
