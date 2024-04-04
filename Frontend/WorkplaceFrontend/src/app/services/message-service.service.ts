import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from './chatRoomService/message';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) { }

  loadMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/room/${roomId}`);
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${messageId}`);
  }
}
