import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, of, tap } from 'rxjs';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';
import { Message } from 'src/app/services/chatRoomService/message';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  roomId: string | null = null;
  messages: Message[] = [];
  newMessageContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private chatRoomService: ChatRoomServiceService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      if (this.roomId) {
        this.loadMessages();
      }
    });
  }

  loadMessages() {
    const id = Number(this.roomId); // or however you need to convert it to the type expected by your service
    this.chatRoomService.getMessagesByRoomId(id).subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.fetchUserNames(this.messages);
        console.log('Messages:', this.messages);
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }

  fetchUserNames(messages: Message[]) {
    // Map each message to an HTTP request to fetch the username
    const usernameRequests = messages.map(message => {
      if (message.userId) {
        return this.chatRoomService.getUserName(message, message.userId)
          .pipe(
            tap(userName => message.userName = userName || 'noname'),
            catchError(error => {
              console.error('Error getting user name:', error);
              return of('noname'); // Return 'noname' in case of error
            })
          );
      } else {
        // If userId is null or undefined, return an Observable immediately
        return of('noname');
      }
    });
  
    // Wait for all username requests to complete
    combineLatest(usernameRequests).subscribe(() => {
      // At this point, all messages have their userName set
      console.log('Messages after fetching usernames:', this.messages);
      // Trigger change detection if necessary
    });
  }

  sendMessage(event: Event) {
    event.preventDefault();
    console.log("JKK content: ", this.newMessageContent);
    console.log("JKK roomId: ", this.roomId);
  }

  testClick() {
    console.log('Button clicked!');
  }
}
