import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from 'src/app/services/chatRoomService/message';
import { MessageServiceService } from 'src/app/services/message-service.service';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent {
  @Input() message!: Message;
  @Output() searchSolution = new EventEmitter<{ content: string, id: number }>();
  @Output() messageDeleted = new EventEmitter<void>(); // Event emitter for message deletion

  constructor(private messageService: MessageServiceService) {}

  onDeleteMessage() {
    const messageId = Number(this.message.messageId);
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        console.log("Deleted message ID:", messageId);
        this.messageDeleted.emit(); // Emit event on successful deletion
      },
      error: (error) => {
        console.error("Error deleting message:", error);
      }
    });
  }

  onSearchSolution() {
    this.searchSolution.emit({ content: this.message.content, id: Number(this.message.messageId) });
  }
}
