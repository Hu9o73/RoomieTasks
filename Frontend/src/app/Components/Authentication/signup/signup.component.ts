import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/Authentication/auth.service';
import { Observable } from 'rxjs'; // Import Observable for handling async operations
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    program: '',
    school: '',
    year: '',
  };

  successMessage: string = '';
  errorMessage: string = '';
  signupResponse$: Observable<any> | undefined; // Observable for signup response

  constructor(private authService: AuthService, private router: Router) {}

  // Handle the form submission
  onSignup() {
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match !';
      console.error(this.errorMessage);
      return;
    }

    if (
      this.user.firstName == '' ||
      this.user.lastName == '' ||
      this.user.password == '' ||
      this.user.program == '' ||
      this.user.year == '' ||
      this.user.school == ''
    ) {
      this.errorMessage = 'Missing data !';
      console.error(this.errorMessage);
      return;
    }

    this.authService.signup(this.user).subscribe(
      (response) => {
        // Handle success
        console.log('Sign-in successful', response);
        this.errorMessage = '';
        this.successMessage = 'User created succesfully ! You can now login.';
      },
      (error) => {
        // Handle error
        this.successMessage = '';
        this.errorMessage =
          'Server error when creating user. User might already exist !';
        console.error(this.errorMessage);
      }
    );
  }
}
