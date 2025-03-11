import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient, private router: Router) {
    // Check if localStorage is available (only in the browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      this.currentUserSubject = new BehaviorSubject<any>(
        localStorage.getItem('currentUser') || 'null'
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }
  }

  get currentUserValue(): any {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  currentUserFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      return -1;
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      return -1;
    }
  }

  // Signup
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Store token and user info
  storeTokenAndUser(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  isBureau(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const bureauRoles = [
        'President',
        'Vice-President',
        'Secretaire',
        'Tresorier',
        'Responsable',
        'Admin',
      ];
      return bureauRoles.includes(decoded.role);
    } catch (error) {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role == 'Admin';
    } catch (error) {
      return false;
    }
  }

  // Get info about user for given token
  whoAmI(token: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(`${this.apiUrl}/whoAmI`, { headers });
  }
}
