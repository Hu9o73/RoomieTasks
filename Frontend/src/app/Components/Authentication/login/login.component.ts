import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/Authentication/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loginResponse$: Observable<any> | undefined; // Use Observable here

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credentials = { email: this.email, password: this.password };

    // Subscribe to the login observable to trigger the HTTP request
    this.authService.login(credentials).subscribe(
      (response) => {
        
        // Handle success
        console.log('Login successful', response);

        // You can store the token and navigate to another page here
        this.authService.storeTokenAndUser(response.token, response.user);
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle error
        console.error('Login failed', error);
        this.errorMessage = 'Invalid credentials.';
      }
    );
  }
}
