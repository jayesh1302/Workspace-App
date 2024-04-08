import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { LoginServiceService } from 'src/app/services/loginService/login-service.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  username: string = '';
  password: string = '';
  registerUsername: string = '';
  registerPassword: string = '';
  signupMessage: string = '';
  loginErrorMessage: string = '';


  constructor(
    private loginService: LoginServiceService, 
    private authService: AuthServiceService,
    private router: Router
  ) {}

  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log(this.username+" successfully logged in!");
        this.authService.login(this.username); // Pass the username to the AuthService
        this.router.navigate(['/home']); // Redirect to the home route on successful login
      },
      error: (error) => {
        console.error('Login error:', error);
        // Check if the error has the expected structure and display the message
        if (error.error && typeof error.error.message === 'string') {
          this.loginErrorMessage = error.error.message; // This is the variable bound to your template
        } else {
          this.loginErrorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }

  register() {
    this.loginService.register(this.registerUsername, this.registerPassword).subscribe({
      next: (response) => {
        console.log('Registered!', response);
        this.signupMessage = response.message; // Set the signup message on successful registration
      },
      error: (error) => console.error('Registration error:', error)
    });
  }

}
