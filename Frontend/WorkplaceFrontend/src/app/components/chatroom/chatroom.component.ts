import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from 'src/app/services/chatRoomService/message';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnChanges { 
  @Input() roomId!: number;
  messages: Message[] = [];

  constructor(private chatRoomService: ChatRoomServiceService) {}

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['roomId'] && changes['roomId'].currentValue != null) {
        this.loadChat();
      }
  }
  

  loadChat() : void {
    console.log(this.roomId);
    this.chatRoomService.getMessagesByRoomId(this.roomId).subscribe({
      next: (messages) => {
        this.messages = messages;
        console.log('Rooms data received:', messages); 
      },
      error: (err: any) => {
        console.error('Failed to load rooms', err);
      }
    });
  }


}
