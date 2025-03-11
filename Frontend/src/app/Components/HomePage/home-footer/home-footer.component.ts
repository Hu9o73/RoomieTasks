import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.css',
})
export class HomeFooterComponent {}
