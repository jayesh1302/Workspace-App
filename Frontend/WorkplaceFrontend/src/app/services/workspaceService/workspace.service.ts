import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = environment.apiUrl+'/api/workspaces';
  constructor(private http: HttpClient) { }

  getWorkspaces(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
