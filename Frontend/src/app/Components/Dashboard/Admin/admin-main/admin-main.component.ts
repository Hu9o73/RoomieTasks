import { Component } from '@angular/core';
import { AdminDashComponent } from '../admin-dash/admin-dash.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [AdminDashComponent],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent {

}
