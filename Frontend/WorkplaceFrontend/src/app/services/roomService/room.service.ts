import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { Room } from './room';

@Injectable({
  providedIn: 'root'
})

export class RoomService {
  private apiUrl = environment.apiUrl; // Ensure that your environment file has apiUrl defined

  constructor(private http: HttpClient) { }

  getRoomsByWorkspaceId(workspaceId: number): Observable<Room[]> {
    const url = `${this.apiUrl}/api/rooms/workspace/${workspaceId}`;
    console.log("JKKKKK" + JSON.stringify(this.http.get<Room[]>(url)));
    return this.http.get<Room[]>(url);
  }
}