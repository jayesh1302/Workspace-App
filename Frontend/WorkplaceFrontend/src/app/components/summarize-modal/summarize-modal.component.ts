import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';

export enum DisplayContentMode {
  Summary,
  SearchSolution
}

@Component({
  selector: 'app-summarize-modal',
  templateUrl: './summarize-modal.component.html',
  styleUrls: ['./summarize-modal.component.css']
})
export class SummarizeModalComponent {
  @Output() close = new EventEmitter<void>();
  summaryContent: string = '';
  displayMode: DisplayContentMode = DisplayContentMode.Summary;
  DisplayContentMode: typeof DisplayContentMode = DisplayContentMode;
  isSummarizeModalOpen: boolean = false;  // Control modal visibility

  constructor(private http: HttpClient) {}

  // Sets the content for the modal based on the type
  setContent(content: string, mode: DisplayContentMode) {
    this.summaryContent = content;
    this.displayMode = mode;
    this.isSummarizeModalOpen = true;  // Ensure the modal is shown when content is set
  }

  // Fetch the summary from the server
  fetchSummary(roomId: number) {
    this.http.get<any>(`http://localhost:8080/api/messages/room/${roomId}/summary`)
      .subscribe({
        next: (response) => {
          if (response && response.choices && response.choices.length > 0) {
            this.setContent(response.choices[0].message.content, DisplayContentMode.Summary);
          } else {
            this.setContent('No summary available', DisplayContentMode.Summary);
          }
        },
        error: (error) => {
          this.setContent('Error fetching summary', DisplayContentMode.Summary);
          console.error('Error fetching summary:', error);
        }
      });
  }

  // Opens the modal and determines which content to fetch based on the type
  open(contentType: 'summary' | 'searchSolution', messageId?: number) {
    this.isSummarizeModalOpen = true;  // Open the modal immediately when this method is called
    if (contentType === 'summary' && messageId !== undefined) {
      this.fetchSummary(messageId);
    } else if (contentType === 'searchSolution' && messageId !== undefined) {
      this.fetchSearchSolution(messageId);  // Assume a similar fetch method for search solution
    }
  }

  // Example method for fetching a search solution
  fetchSearchSolution(id: number) {
    // Dummy API endpoint for example
    this.http.get<string>(`http://localhost:8080/api/searchSolution/${id}`)
      .subscribe({
        next: (content) => {
          this.setContent(content, DisplayContentMode.SearchSolution);
        },
        error: (error) => {
          console.error('Error searching for solution:', error);
          this.setContent('Error fetching solution', DisplayContentMode.SearchSolution);
        }
      });
  }

  // Close the modal
  onClose() {
    this.isSummarizeModalOpen = false;  // Hide the modal when closing
    this.summaryContent = '';
    this.close.emit();
  }
}