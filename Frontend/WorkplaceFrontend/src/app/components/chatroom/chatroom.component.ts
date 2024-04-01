import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, of, tap } from 'rxjs';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';
import { Message } from 'src/app/services/chatRoomService/message';
import { SummarizeModalComponent } from '../summarize-modal/summarize-modal.component';
import { OpenAIServiceService } from 'src/app/services/openAIService/open-aiservice.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  @ViewChild(SummarizeModalComponent) summarizeModalComponent!: SummarizeModalComponent;
  roomId: string | null = null;
  messages: Message[] = [];
  newMessageContent: string = '';
  isSummarizeModalOpen: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private chatRoomService: ChatRoomServiceService,
    public openAIService: OpenAIServiceService
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
              return of('admin'); // Return 'noname' in case of error
            })
          );
      } else {
        // If userId is null or undefined, return an Observable immediately
        return of('admin');
      }
    });
  
    // Wait for all username requests to complete
    combineLatest(usernameRequests).subscribe(() => {
    });
  }
  
  sendMessage(event: Event) {
    event.preventDefault();
    if (this.roomId) {
      const messageToSend: Message = {
        content: this.newMessageContent,
        userId: 1,
        roomId: Number(this.roomId)
      };
  
      const roomIdNumber = Number(this.roomId);
  
      this.chatRoomService.sendMessage(roomIdNumber, messageToSend).subscribe({
        next: (savedMessage) => {
          console.log('Message sent:', savedMessage);
          this.messages.push(savedMessage);
          this.newMessageContent = '';
  
          // Delay the chat refresh by 1000ms (1 second)
          setTimeout(() => {
            this.loadMessages();
          }, 1000);
  
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    } else {
      console.error('Room ID is null, cannot send message');
    }
  }

  openSummarizeModal() {
      if (this.roomId !== null) {
    this.isSummarizeModalOpen = true;
    // Assuming you have modified the open method to take two parameters.
    this.summarizeModalComponent.open('summary', Number(this.roomId));
  } else {
    // Handle the case where roomId is null
    console.error('Room ID is null');
  }
}

  

onSearchSolution(event: { content: string, id: number }) {
  this.openAIService.searchSolution(event.id).subscribe({
    next: (content) => {
      // Directly using the content as the response is mapped to a string.
      this.summarizeModalComponent.summaryContent = content;
      this.isSummarizeModalOpen = true;
      console.log("Content: " + content); // Should log the content now
    },
    error: (error) => {
      console.error('Error searching for solution:', error);
      this.summarizeModalComponent.summaryContent = 'Error fetching solution';
      this.isSummarizeModalOpen = true;
    }
  });
  }
}
