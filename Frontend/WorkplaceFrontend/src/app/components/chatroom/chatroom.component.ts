import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { Subscription, catchError, combineLatest, interval, of, startWith, switchMap, tap } from 'rxjs';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';
import { Message } from 'src/app/services/chatRoomService/message';
import { SummarizeModalComponent } from '../summarize-modal/summarize-modal.component';
import { OpenAIServiceService } from 'src/app/services/openAIService/open-aiservice.service';
import { MessageServiceService } from 'src/app/services/messageService/message-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatroomComponent implements OnInit, OnDestroy , AfterViewChecked {
  @ViewChild(SummarizeModalComponent) summarizeModalComponent!: SummarizeModalComponent;
  @ViewChild('chatContainer', { static: false }) private chatContainer!: ElementRef;
  roomId: string | null = null;
  messages: Message[] = [];
  newMessageContent: string = '';
  isSummarizeModalOpen: boolean = false;
  currentUsername: string | null = null;
  private pollingSubscription!: Subscription;
  quickResponses: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageServiceService,
    private chatRoomService: ChatRoomServiceService,
    private authService: AuthServiceService,
    private openAIService: OpenAIServiceService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      this.startPollingForMessages();
    });
    this.authService.username$.subscribe(username => {
      this.currentUsername = username;
      if (!username) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.pollingSubscription.unsubscribe();  // Stop polling when component is destroyed
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      const chatElement = this.chatContainer.nativeElement;
      // Check if the user is close to the bottom of the chat.
      const isUserScrolledToBottom = chatElement.scrollHeight - chatElement.scrollTop <= chatElement.clientHeight * 1.2; // 1.2 is a factor of tolerance
  
      if (isUserScrolledToBottom) {
        // If the user is at the bottom, perform the scroll
        const maxScroll = chatElement.scrollHeight - chatElement.clientHeight;
        chatElement.scroll({
          top: maxScroll,
          behavior: 'smooth'
        });
      }
    }
  }
  

  startPollingForMessages() {
    if (this.roomId) {
      this.pollingSubscription = interval(1000)
        .pipe(
          startWith(0),
          switchMap(() => this.messageService.loadMessages(Number(this.roomId)))
        )
        .subscribe(newMessages => {
          if (!this.messagesAreEqual(this.messages, newMessages)) {
            this.messages = newMessages;
          }
        }, error => console.error('Error loading messages:', error));
    }
  }
  
  messagesAreEqual(currentMessages: Message[], newMessages: Message[]): boolean {
    if (currentMessages.length !== newMessages.length) return false;
    return currentMessages.every((msg, index) => msg.messageId === newMessages[index].messageId);
  }

  loadMessages() {
    if (this.roomId) {
      const id = Number(this.roomId);
      this.messageService.loadMessages(id).subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          console.log('Messages:', this.messages);
          this.fetchUserNames(this.messages);
          this.fetchQuickResponsesForLastMessage(); // Fetch quick responses for the last message
        },
        (error: any) => {
          console.error('Error loading messages:', error);
        }
      );
    }
  }

  // You can use this method to refresh the messages when notified
  onMessageDeleted() {
    this.loadMessages();
  }

  fetchUserNames(messages: Message[]) {
    return this.currentUsername;  
  }
  
  sendMessage(event: Event) {
  event.preventDefault();
  console.log(this.currentUsername + ": " + this.newMessageContent);
  
  if (!this.currentUsername || !this.roomId || !this.newMessageContent.trim()) {
    // Handle the case where there is no user, room ID, or message content
    console.error('Username, Room ID, or message content is missing, cannot send message');
    return; // Do not proceed with sending the message
  }

  const userIdObservable = this.chatRoomService.getUserIdByUsername(this.currentUsername);
  const roomIdNumber = Number(this.roomId);

  userIdObservable.subscribe({
    next: (userId) => {
      const messageToSend: Message = {
        content: this.newMessageContent,
        userId: userId,
        userName: String(this.currentUsername),
        roomId: roomIdNumber
      };

      // Send the message using your chatRoomService or appropriate service
      this.chatRoomService.sendMessage(roomIdNumber, messageToSend)
        .pipe(
          catchError((error) => {
            console.error('Error sending message:', error);
            return of(null); // Handle the error and return a null Observable
          })
        )
        .subscribe({
          next: (savedMessage) => {
            if (savedMessage) {
              console.log('Message sent:', savedMessage);
              this.messages.push(savedMessage);
              this.newMessageContent = ''; // Clear the input field
              this.scrollToBottom(); // Scroll to the bottom to show the new message
              this.fetchQuickResponsesForLastMessage(); // Fetch quick responses for the last message
            }
          }
        });
    },
    error: (error) => console.error('Error fetching user ID:', error)
  });
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

  getCurrentUsername() {
    return this.currentUsername;
  }

  fetchQuickResponsesForLastMessage() {
    if (!this.messages || this.messages.length === 0) {
      return; // Exit if there are no messages
    }
    const lastMessageContent = this.messages[this.messages.length - 1].content;
    this.openAIService.getQuickResponses(lastMessageContent).subscribe({
      next: (responses) => {
        this.quickResponses = responses; // Now contains the top 3 quick responses
      },
      error: (error) => {
        console.error('Error fetching quick responses:', error);
      }
    });
  }

  selectQuickResponse(response: string) {
    this.newMessageContent = response; // Set the response as the message content
  }
}
