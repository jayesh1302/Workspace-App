import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
