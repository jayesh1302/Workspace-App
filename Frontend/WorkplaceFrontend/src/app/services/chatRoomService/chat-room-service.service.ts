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
    return  this.http.get<Message[]>(url);
  }

  getUserName(message: Message, userId: number): Observable<string> {
    const url = `http://localhost:8080/api/user/getusername/${userId}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error getting username:', error);
          return of('admin'); // Provides a default username in case of error
        })
      );
  }

  sendMessage(roomId: number, message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/api/messages/room/${roomId}`, message);
  }

  addRoom(roomName: string, workspaceId: number) {
    const url = `http://localhost:8080/api/rooms/workspace/${workspaceId}`;
    const payload = { name: roomName };
    return this.http.post(url, payload);
  }
}
