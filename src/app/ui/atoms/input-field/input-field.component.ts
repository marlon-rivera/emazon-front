import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  
  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() size: number = 50;
  @Input() required!: boolean;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();


  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
  }

  onBlur() {
    this.blur.emit();
  }

}
