import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor() {}

  // Call this method when the user logs in
  login(username: string) {
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(username);
  }

  // Call this method when the user logs out
  logout() {
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
  }

  // Helper method to get the current value of the logged-in status
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Helper method to get the current value of the username
  getCurrentUsername(): string | null {
    return this.usernameSubject.value;
  }
}
