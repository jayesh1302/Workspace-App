import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = `${environment.apiUrl}/api/workspaces`;
  private workspacesSubject = new BehaviorSubject<any[]>([]);
  workspaces$ = this.workspacesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchWorkspaces() {
    this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => this.workspacesSubject.next(data))
    ).subscribe();
  }

  getWorkspaces(): Observable<any[]> {
    return this.workspaces$;
  }
  deleteWorkspace(workspaceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${workspaceId}`);
  }
  addNewWorkspace(workspaceName: string) {
    const requestBody = { name: workspaceName };
    return this.http.post(this.apiUrl, requestBody);
  }
}
