import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {

  @Input() fieldId!: string;
  @Input() fieldName!: string;
  @Input() labelText!: string;
  @Input() inputValue!: string;

  @Output() inputValueChange = new EventEmitter<string>();
  @Output() touchedChange = new EventEmitter<void>();


  onInputChange(newValue: string) {
    this.inputValue = newValue;
    this.inputValueChange.emit(this.inputValue);
  }

  onBlur() {
    this.touchedChange.emit();
  }

}
