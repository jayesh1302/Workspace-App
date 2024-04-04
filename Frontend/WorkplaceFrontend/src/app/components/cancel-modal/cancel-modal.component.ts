import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styleUrls: ['./cancel-modal.component.css']
})
export class CancelModalComponent {
  @Output() onConfirmCancellation = new EventEmitter<void>();
  @Input() show: boolean = false;

  constructor() {}

  confirmCancellation() {
    this.onConfirmCancellation.emit();
    this.show = false; // Assuming you handle visibility through this component's @Input()
  }

  closeModal() {
    this.show = false; // Add this method to change show to false when No is clicked
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeModal();
    }
  }
}
