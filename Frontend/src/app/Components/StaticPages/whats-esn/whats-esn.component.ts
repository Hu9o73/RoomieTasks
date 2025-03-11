import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { HomeFooterComponent } from '../../HomePage/home-footer/home-footer.component';

@Component({
  selector: 'app-whats-esn',
  standalone: true,
  imports: [NavbarComponent, HomeFooterComponent],
  templateUrl: './whats-esn.component.html',
  styleUrl: './whats-esn.component.css',
})
export class WhatsESNComponent {}
