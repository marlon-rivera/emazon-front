import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
