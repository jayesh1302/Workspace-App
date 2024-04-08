import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIServiceService {

  constructor(private http: HttpClient) { }

  searchSolution(messageId: number): Observable<string> {
    const url = `http://localhost:8080/api/messages/${messageId}/search`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        // Assuming that the response has a `choices` array and you need the `content` of the first message.
        if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
          return response.choices[0].message.content;
        } else {
          throw new Error('No content available or unexpected response structure.');
        }
      }),
      tap(
        content => console.log(`Content: ${content}`),
        error => console.error(`Error during search for message ID: ${messageId}`, error)
      )
    );
  }

  getQuickResponses(prompt: string): Observable<string[]> {
    const url = 'http://localhost:8080/api/chatgpt/quick-responses'; // replace with your actual endpoint
    const headers = new HttpHeaders({'Content-Type': 'text/plain'});

    // Assuming the API expects a POST request with the prompt
    return this.http.post<any>(url, { prompt }).pipe(
      map(response => {
        // Assuming the API returns an array of responses
        if (response && Array.isArray(response.responses)) {
          return response.responses.slice(0, 3); // Take only the top 3 responses
        } else {
          throw new Error('Unexpected response structure or no responses.');
        }
      }),
      tap(
        responses => console.log(`Quick responses:`, responses),
        error => console.error(`Error during getQuickResponses with prompt: ${prompt}`, error)
      )
    );
  }
}
