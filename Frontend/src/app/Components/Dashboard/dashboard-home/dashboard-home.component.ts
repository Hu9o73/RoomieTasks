import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../../Services/Tasks/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent implements OnInit {
  upcomingTasks: Task[] = [];
  loading = true;
  error = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadUpcomingTasks();
  }

  loadUpcomingTasks(): void {
    this.taskService.getUpcomingTasks().subscribe({
      next: (response) => {
        console.log('Upcoming tasks loaded:', response);
        this.upcomingTasks = response.tasks;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading upcoming tasks', err);
        this.error = `Failed to load upcoming tasks: ${err.status} ${err.statusText}`;
        if (err.error && err.error.error) {
          this.error += ` - ${err.error.error}`;
        }
        this.loading = false;
      }
    });
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-info';
      default: return '';
    }
  }
}