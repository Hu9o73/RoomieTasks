import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Modify a User
  modifyUser(token: string, data: any): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.checkPwd(token, data.password).pipe(
      switchMap((response) => {
        if (response.validPass == true) {
          return this.http.put(`${this.apiUrl}/modifyMe`, data, { headers });
        } else {
          return throwError('Wrong password!');
        }
      }),
      // Any error is caught here
      catchError((error) => {
        return throwError('Wrong password!');
      })
    );
  }

  checkPwd(token: string, password: string): Observable<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = { password: password };
    return this.http.post(`${this.apiUrl}/verifyPwd`, body, { headers });
  }
}
