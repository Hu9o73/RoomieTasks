import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Household, HouseholdDetails } from '../../models/household.model';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create headers with authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all households for the current user
  getHouseholds(): Observable<{ households: Household[] }> {
    const headers = this.getAuthHeaders();
    console.log('Fetching households with headers:', headers);
    
    return this.http.get<{ households: Household[] }>(`${this.apiUrl}/households`, { headers })
      .pipe(
        tap(response => console.log('Households response:', response)),
        catchError(this.handleError)
      );
  }

  // Get a specific household with members
  getHouseholdDetails(id: number): Observable<HouseholdDetails> {
    const headers = this.getAuthHeaders();
    return this.http.get<HouseholdDetails>(`${this.apiUrl}/households/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Create a new household
  createHousehold(name: string): Observable<{ message: string, household: Household }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string, household: Household }>(
      `${this.apiUrl}/households`,
      { name },
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Join a household with invite code
  joinHousehold(inviteCode: string): Observable<{ message: string, household: Household }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string, household: Household }>(
      `${this.apiUrl}/households/join`,
      { inviteCode },
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Update household details
  updateHousehold(id: number, name: string): Observable<{ message: string, household: Household }> {
    const headers = this.getAuthHeaders();
    return this.http.put<{ message: string, household: Household }>(
      `${this.apiUrl}/households/${id}`,
      { name },
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Generate a new invite code
  generateNewInviteCode(id: number): Observable<{ message: string, inviteCode: string }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string, inviteCode: string }>(
      `${this.apiUrl}/households/${id}/newInviteCode`,
      {},
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Leave a household
  leaveHousehold(id: number): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/households/${id}/leave`, 
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Delete a household
  deleteHousehold(id: number): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/households/${id}`,
      { headers }
    ).pipe(catchError(this.handleError));
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      console.error('Network error - backend may be down:', error.error);
    } else if (error.status === 401) {
      console.error('Authentication error - token may be invalid or missing:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    
    return throwError(() => error);
  }
}