import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all tasks for a household
  getHouseholdTasks(householdId: number): Observable<{ tasks: Task[] }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/households/${householdId}/tasks`, { headers });
  }

  // Get tasks assigned to the current user
  getMyTasks(): Observable<{ tasks: Task[] }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/tasks/my-tasks`, { headers });
  }

  // Get upcoming tasks
  getUpcomingTasks(): Observable<{ tasks: Task[] }> {
    // For now, let's work around the issue by using getMyTasks instead (/tasks/upcoming is not working)
    // until we debug the proper endpoint
    return this.getMyTasks();
    
    // Original code:
    // const headers = this.getAuthHeaders();
    // console.log('Fetching upcoming tasks from:', `${this.apiUrl}/tasks/upcoming`);
    // return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/tasks/upcoming`, { headers });
  }

  // Get a specific task
  getTask(id: number): Observable<{ task: Task }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ task: Task }>(`${this.apiUrl}/tasks/${id}`, { headers });
  }

  // Create a new task
  createTask(task: Partial<Task>): Observable<{ message: string, task: Task }> {
    const headers = this.getAuthHeaders();
    return this.http.post<{ message: string, task: Task }>(`${this.apiUrl}/tasks`, task, { headers });
  }

  // Update task
  updateTask(id: number, task: Partial<Task>): Observable<{ message: string, task: Task }> {
    const headers = this.getAuthHeaders();
    return this.http.put<{ message: string, task: Task }>(`${this.apiUrl}/tasks/${id}`, task, { headers });
  }

  // Complete task
  completeTask(id: number): Observable<{ message: string, task: Task }> {
    const headers = this.getAuthHeaders();
    console.log(`Completing task ${id} at URL: ${this.apiUrl}/tasks/${id}/complete`);
    
    return this.http.patch<{ message: string, task: Task }>(
      `${this.apiUrl}/tasks/${id}/complete`, 
      {}, 
      { headers }
    );
  }

  markTaskPending(id: number): Observable<{ message: string, task: Task }> {
    const headers = this.getAuthHeaders();
    console.log(`Marking task ${id} as pending`);
    
    return this.http.patch<{ message: string, task: Task }>(
      `${this.apiUrl}/tasks/${id}/pending`, 
      {}, 
      { headers }
    );
  }

  // Delete task
  deleteTask(id: number): Observable<{ message: string }> {
    const headers = this.getAuthHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/tasks/${id}`, { headers });
  }
}