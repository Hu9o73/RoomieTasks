import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { HomeFooterComponent } from '../../HomePage/home-footer/home-footer.component';

@Component({
  selector: 'app-the-team',
  standalone: true,
  imports: [NavbarComponent, HomeFooterComponent],
  templateUrl: './the-team.component.html',
  styleUrl: './the-team.component.css',
})
export class TheTeamComponent {}
