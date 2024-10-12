import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() text!: string;
  @Input() disabledButton!: boolean;
  @Input() buttonText!: string;
  @Output() buttonClick =  new EventEmitter<void>();

  handleClick(event: Event){
    event.preventDefault();
    this.buttonClick.emit();
  }
}
