import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Message } from 'src/app/services/chatRoomService/message';
import { MessageServiceService } from 'src/app/services/messageService/message-service.service';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent {
  @Input() message!: Message;
  @Output() searchSolution = new EventEmitter<{ content: string, id: number }>();
  @Output() messageDeleted = new EventEmitter<void>();

  userName$: Observable<string>;

  constructor(private http: HttpClient, private messageService: MessageServiceService) {
    this.userName$ = of(''); // Initialize with empty or default value
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.getUserName(Number(this.message.userId)).subscribe(userName => {
        this.message.userName = userName;
      });
    }
  }

  getUserName(userId: number): Observable<string> {
    const url = `http://localhost:8080/api/user/getusername/${userId}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error getting username:', error);
          return of('Unknown'); // Fallback username in case of error
        })
      );
  }

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
