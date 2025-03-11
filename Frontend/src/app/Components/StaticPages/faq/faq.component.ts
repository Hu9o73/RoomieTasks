import { Component } from '@angular/core';
import { NavbarComponent } from '../../Utils/navbar/navbar.component';
import { HomeFooterComponent } from '../../HomePage/home-footer/home-footer.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NavbarComponent, HomeFooterComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {

}
