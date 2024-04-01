import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'src/app/services/chatRoomService/message';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent {
  @Input() message!: Message;

  @Output() searchSolution = new EventEmitter<{ content: string, id: number }>();

  onSearchSolution() {
    console.log('Message content:', this.message.content);
    console.log('Message ID:', this.message.messageId);
    this.searchSolution.emit({ content: this.message.content, id: Number(this.message.messageId) });
  }
}
