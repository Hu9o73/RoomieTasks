import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/Authentication/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BureauGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isBureau()) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
