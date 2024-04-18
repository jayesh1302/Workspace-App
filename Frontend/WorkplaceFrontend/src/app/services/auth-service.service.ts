import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string | null>(null);

  // Observable properties are exposed to components to subscribe to
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public username$ = this.usernameSubject.asObservable();

  constructor() {}

  // Method to call when the user logs in, updating both isLoggedIn and username
  login(username: string) {
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(username);
  }

  // Method to call when the user logs out, resetting isLoggedIn and username
  logout() {
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
  }

  // Helper method to get the current value of the logged-in status synchronously
  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  // Helper method to get the current username synchronously
  getCurrentUsername(): string | null {
    return this.usernameSubject.getValue();
  }
}