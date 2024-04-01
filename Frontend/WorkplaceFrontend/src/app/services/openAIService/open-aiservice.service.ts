import { HttpClient } from '@angular/common/http';
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
}
