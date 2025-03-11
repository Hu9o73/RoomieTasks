import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/Authentication/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-navbar.component.html',
  styleUrl: './dashboard-navbar.component.css',
})
export class DashboardNavbarComponent {
  isBureau: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkRoles();
  }

  checkRoles() {
    // Check if the user is authenticated
    this.isAdmin = this.authService.isAdmin();
  }
}
