import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [RouterModule, NavbarComponent, DashboardNavbarComponent],
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.css'
})
export class DashboardMainComponent {

}
