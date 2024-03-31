import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-summarize-modal',
  templateUrl: './summarize-modal.component.html',
  styleUrls: ['./summarize-modal.component.css']
})
export class SummarizeModalComponent {
  @Output() close = new EventEmitter<void>();
  summaryContent: string = '';

  constructor(private http: HttpClient) {}

  open(roomId: number) {
    this.fetchSummary(roomId);
  }

  fetchSummary(roomId: number) {
    this.http.get<any>(`http://localhost:8080/api/messages/room/${roomId}/summary`)
      .subscribe({
        next: (response) => {
          // Accessing the content field
          if (response.choices && response.choices.length > 0) {
            this.summaryContent = response.choices[0].message.content;
          } else {
            this.summaryContent = 'No summary available';
          }
        },
        error: (error) => {
          console.error('Error fetching summary:', error);
        }
      });
  }

  onClose() {
    this.close.emit();
  }

}
