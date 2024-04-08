import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private loginUrl = 'http://localhost:8080/api/user/login';
  private registerUrl = 'http://localhost:8080/api/user/register';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.registerUrl, { username, password }).pipe(
      tap(() => {
        // Handle success message here if needed, e.g. using a notification service or local state
        this.showSuccessMessage('Sign up successful. Please login.');
      })
    );
  }

  private showSuccessMessage(message: string): void {
    // Implement this method to show a message to the user.
    // For example, using a service that manages notifications or simply logging to the console.
    console.log(message);
  }
}
