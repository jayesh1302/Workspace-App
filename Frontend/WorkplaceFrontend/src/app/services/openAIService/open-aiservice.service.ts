import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

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
    const url = 'http://localhost:8080/api/messages/quick-responses'; // Correct endpoint as per Postman
    const headers = new HttpHeaders({'Content-Type': 'application/json'}); // Ensure header matches Postman
  
    return this.http.post<string[]>(url, { prompt }, { headers }).pipe(
      map(response => {
        // Directly check if the response is an array
        if (Array.isArray(response)) {
          return response.slice(0, 3); // Take only the top 3 responses
        } else {
          throw new Error('Unexpected response structure.');
        }
      }),
      catchError((error) => {
        console.error(`Error during getQuickResponses with prompt: ${prompt}`, error);
        return throwError(() => new Error('Error fetching quick responses.'));
      })
    );
  }
}
