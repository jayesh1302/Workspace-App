import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-attach-modal',
  templateUrl: './attach-modal.component.html',
  styleUrls: ['./attach-modal.component.css']
})
export class AttachModalComponent {
  selectedFile: File | null = null;

  @Output() fileAttached = new EventEmitter<File>();
  @Output() closeModalEvent = new EventEmitter<void>(); // Emit when modal needs to be closed

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0] || null;
  }

  closeModal() {
    this.closeModalEvent.emit(); // Notify the parent to close the modal
  }

  confirmAttachment() {
    if (this.selectedFile) {
      this.fileAttached.emit(this.selectedFile);
      this.closeModal();
    }
  }
}