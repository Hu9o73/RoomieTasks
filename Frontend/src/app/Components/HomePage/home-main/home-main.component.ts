import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { HomeHeaderComponent } from '../home-header/home-header.component';
import { HomeFooterComponent } from '../home-footer/home-footer.component';
import { SecondaryHomeHeaderComponent } from '../secondary-home-header/secondary-home-header.component';

@Component({
  selector: 'app-home-main',
  standalone: true,
  imports: [
    NavbarComponent,
    HomeHeaderComponent,
    HomeFooterComponent,
    SecondaryHomeHeaderComponent,
  ],
  templateUrl: './home-main.component.html',
  styleUrl: './home-main.component.css',
})
export class HomeMainComponent {}
