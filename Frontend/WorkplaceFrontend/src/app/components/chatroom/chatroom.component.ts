import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { Subscription, catchError, combineLatest, delay, interval, of, startWith, switchMap, tap } from 'rxjs';
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
  @ViewChild(SummarizeModalComponent) summarizeModalComponent?: SummarizeModalComponent;
  @ViewChild('chatContainer', { static: false }) private chatContainer?: ElementRef;
  roomId: string | null = null;
  messages: Message[] = [];
  newMessageContent: string = '';
  isSummarizeModalOpen: boolean = false;
  currentUsername: string | null = null;
  private pollingSubscription?: Subscription;
  quickResponses: string[] = [];
  showQuickResponses: boolean = false;
  isAttachModalOpen: boolean = false;
  attachedFile: File | null = null;

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
      } else {
        this.loadMessages(); // Load messages only after we have the current username
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe(); // Properly unsubscribe
    }
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
            // Call the method to check and fetch quick responses
            this.checkQuickResponseChips();
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
      this.messageService.loadMessages(id)
        .subscribe(messages => {
          this.messages = messages;
          console.log('Messages after loading:', this.messages);
          this.checkQuickResponseChips();
        }, error => {
          console.error('Error loading messages:', error);
        });
    }
  }

  checkQuickResponseChips() {
    // The method should check the sender of the last message
    // and update the showQuickResponses flag accordingly.
    if (this.messages.length > 0 && !this.isLastMessageByCurrentUser()) {
      this.fetchQuickResponsesForLastMessage();
    } else {
      this.showQuickResponses = false;
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
    if (!this.currentUsername || !this.roomId || !this.newMessageContent.trim()) {
      console.error('Username, Room ID, or message content is missing, cannot send message');
      return;
    }
  
    const userIdObservable = this.chatRoomService.getUserIdByUsername(this.currentUsername);
    const roomIdNumber = Number(this.roomId);
  
    userIdObservable.subscribe(userId => {
      const messageToSend: Message = {
        content: this.newMessageContent,
        userId: userId,
        userName: String(this.currentUsername),
        roomId: roomIdNumber,
      };
  
      this.chatRoomService.sendMessage(roomIdNumber, messageToSend)
        .pipe(
          catchError(error => {
            console.error('Error sending message:', error);
            return of(null);
          })
        )
        .subscribe(savedMessage => {
          if (savedMessage) {
            console.log('Message sent:', savedMessage);
            this.newMessageContent = '';
            this.scrollToBottom();
            this.loadMessages();
          }
        });
    });
  }

  openSummarizeModal() {
    if (this.roomId !== null && this.summarizeModalComponent) {
      this.isSummarizeModalOpen = true;
      this.summarizeModalComponent.open('summary', Number(this.roomId));
    } else {
      console.error('Room ID is null or modal component not available');
    }
  }


  

  onSearchSolution(event: { content: string, id: number }) {
    if (this.summarizeModalComponent) {
      this.isSummarizeModalOpen = true; // Ensure modal is open when searching for solutions
      this.summarizeModalComponent.setContent('Loading...', this.summarizeModalComponent.DisplayContentMode.SearchSolution);

      this.openAIService.searchSolution(event.id).subscribe({
        next: (content) => {
          this.summarizeModalComponent?.setContent(content, this.summarizeModalComponent.DisplayContentMode.SearchSolution);
        },
        error: (error) => {
          console.error('Error searching for solution:', error);
          this.summarizeModalComponent?.setContent('Error fetching solution', this.summarizeModalComponent.DisplayContentMode.SearchSolution);
        }
      });
    } else {
      console.error('SummarizeModalComponent is not available');
    }
  }

  fetchQuickResponsesForLastMessage() {
    const lastMessage = this.messages[this.messages.length - 1];
    if (!lastMessage || lastMessage.userName === this.currentUsername) {
      this.showQuickResponses = false;
      return;
    }
    
    // Comment out the actual service call
    // this.openAIService.getQuickResponses(lastMessageContent)
    //   .subscribe(responses => {
    //     this.quickResponses = responses;
    //     this.showQuickResponses = true;
    //   }, error => {
    //     console.error('Error fetching quick responses:', error);
    //     this.showQuickResponses = false;
    //   });
  
    // Mocked response for demonstration
    this.quickResponses = [
      "That's interesting, tell me more.",
      "Thank you for sharing that with me.",
      "I'm here to help, what can I do for you?"
    ];
    this.showQuickResponses = true;
  }
  
  
  isLastMessageByCurrentUser(): boolean {
    const lastMessage = this.messages[this.messages.length - 1];
    return lastMessage && lastMessage.userName === this.currentUsername;
  }
  

  // fetchQuickResponsesForLastMessage() {
  //   if (!this.messages || this.messages.length === 0) {
  //       return; // Exit if there are no messages
  //   }

  //   // Hardcoded top 3 quick responses
  //   this.quickResponses = [
  //       'Hi, how can I help you?',
  //       'Can you provide more details?',
  //       'I will look into this issue.'
  //   ];
  // }

  selectQuickResponse(response: string) {
    this.newMessageContent = response; // Set the response as the message content
  }

  openAttachModal() {
    this.isAttachModalOpen = true;
  }
  
  onFileAttached(file: File) {
    // handle file logic here, e.g., storing the file for sending, displaying an icon, etc.
    console.log('Attached file:', file);
    // Logic to show file upload icon or display next to the input field
  }

  
}