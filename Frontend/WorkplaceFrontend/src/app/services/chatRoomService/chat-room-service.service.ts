import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomServiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMessagesByRoomId(roomId: number) : Observable<Message[]> {
    const url = `${this.apiUrl}/api/messages/room/${roomId}`;
    console.log("JKKKK getMessagesByRoomId " + JSON.stringify(this.http.get<Message[]>(url)) );
    return  this.http.get<Message[]>(url);
  }

  getUserName(message: Message, userId: number): Observable<string> {
    const url = `http://localhost:8080/api/user/getusername/${userId}`;
    return this.http.get(url, { responseType: 'text' })
      .pipe(
        map(responseText => {
          try {
            const jsonResponse = JSON.parse(responseText);
            return jsonResponse.username || 'noname';
          } catch (error) {
            console.error('Error parsing username:', error);
            return 'admin';
          }
        }),
        catchError(error => {
          console.error('Error getting username:', error);
          return of('admin');
        })
      );
  }

  sendMessage(roomId: number, message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/api/messages/room/${roomId}`, message);
  }
}
