import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { HomeFooterComponent } from '../../HomePage/home-footer/home-footer.component';

@Component({
  selector: 'app-whats-roomietasks',
  standalone: true,
  imports: [NavbarComponent, HomeFooterComponent],
  templateUrl: './whats-roomietasks.component.html',
  styleUrl: './whats-roomietasks.component.css',
})
export class WhatsRoomieTasksComponent {}
