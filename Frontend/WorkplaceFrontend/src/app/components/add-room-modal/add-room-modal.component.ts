import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-room-modal',
  templateUrl: './add-room-modal.component.html',
  styleUrls: ['./add-room-modal.component.css']
})
export class AddRoomModalComponent {
  // @Input() show: boolean = false;
  // @Output() confirmAdd = new EventEmitter<{ name: string, workspaceId: number }>();
  // @Output() closeModal = new EventEmitter<boolean>();
  // roomName = '';
  // @Output() confirmAdd = new EventEmitter<string>();

  // open() {
  //   this.show = true;
  // }

  // close() {
  //   this.show = false;
  // }

  // confirmAddRoom() {
  //   this.confirmAdd.emit(this.roomName);
  //   this.roomName = ''; // Reset the room name
  //   this.close();
  // }
}
