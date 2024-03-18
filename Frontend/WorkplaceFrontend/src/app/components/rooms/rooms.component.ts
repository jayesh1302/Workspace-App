import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Room } from 'src/app/services/roomService/room';
import { RoomService } from 'src/app/services/roomService/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnChanges {
  @Input() workspaceId!: number;
  rooms: Room[] = [];
  selectedRoomId?: number;

  constructor(private roomService: RoomService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workspaceId'] && changes['workspaceId'].currentValue != null) {
      this.loadRooms();
    }
  }

  loadRooms(): void {
    this.roomService.getRoomsByWorkspaceId(this.workspaceId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (err) => {
        console.error('Failed to load rooms', err);
      }
    });
  }

  selectRoom(roomId: number): void {
    console.log(roomId);
    console.log(`Selected room ${roomId}`);
    this.selectedRoomId = roomId;
  }

}
