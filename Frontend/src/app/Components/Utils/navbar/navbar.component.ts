import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/Authentication/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    if (typeof window !== 'undefined' && window.localStorage) {
      console.log('Answer:');
      const token = localStorage.getItem('token');
      if (token) {
        this.http
          .get(`${environment.apiUrl}/protected`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .subscribe({
            next: (response) => {
              console.log('Answer:');
              console.log(response);
            },
            error: (error) => {
              console.error('ERROR: ', error);
            },
          });
      } else {
        console.log('No token found.');
      }
    }
  }

  checkAuthentication() {
    // Check if the user is authenticated
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.user = this.authService.currentUserValue; // Get the logged-in user
    }
  }

  logout() {
    // Call the AuthService to log out the user
    this.authService.logout();
    window.location.reload();
    this.router.navigate(['/home']);
  }
}
