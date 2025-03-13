import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Services/Tasks/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  householdId!: number;
  tasks: Task[] = [];
  filteredTasks: Task[] = []; // Store filtered tasks separately
  loading = true;
  error = '';
  
  // Filter and sort options
  filterStatus: 'all' | 'pending' | 'completed' = 'all';
  sortBy: 'dueDate' | 'priority' | 'status' = 'dueDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.householdId = +params['householdId'];
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getHouseholdTasks(this.householdId).subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.applyFiltersAndSort(); // This will update filteredTasks
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.error = err.error?.error || 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    // Filter tasks
    if (this.filterStatus === 'all') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.filterStatus);
    }
    
    // Sort tasks
    this.filteredTasks.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (this.sortBy === 'priority') {
        const priorityValues = { 'low': 1, 'medium': 2, 'high': 3 };
        comparison = priorityValues[a.priority] - priorityValues[b.priority];
      } else if (this.sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  toggleTaskStatus(task: Task, event: Event): void {
    event.stopPropagation();
    
    if (task.status === 'completed') {
      // If already completed, mark as pending
      console.log(`Marking task ${task.id} as pending`);
      this.taskService.markTaskPending(task.id).subscribe({
        next: () => {
          console.log('Task marked as pending');
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error marking task as pending', err);
          this.error = err.error?.error || 'Failed to update task status';
        }
      });
    } else {
      // If pending, mark as completed
      console.log(`Completing task ${task.id}`);
      this.taskService.completeTask(task.id).subscribe({
        next: () => {
          console.log('Task marked as completed');
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error completing task', err);
          this.error = err.error?.error || 'Failed to update task status';
        }
      });
    }
  }

  deleteTask(taskId: number, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        // Remove task locally
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error deleting task', err);
        this.error = err.error?.error || 'Failed to delete task';
      }
    });
  }

  createTask(): void {
    this.router.navigate(['/dashboard/households', this.householdId, 'tasks', 'new']);
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/dashboard/households', this.householdId, 'tasks', taskId]);
  }

  changeFilter(status: 'all' | 'pending' | 'completed'): void {
    this.filterStatus = status;
    this.applyFiltersAndSort();
  }

  changeSort(sortBy: 'dueDate' | 'priority' | 'status'): void {
    if (this.sortBy === sortBy) {
      // If already sorting by this field, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortDirection = 'asc';
    }
    
    this.applyFiltersAndSort();
  }
}