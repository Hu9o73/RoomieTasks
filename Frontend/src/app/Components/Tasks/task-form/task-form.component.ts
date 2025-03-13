import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Services/Tasks/task.service';
import { HouseholdService } from '../../../Services/Households/household.service';
import { Task } from '../../../models/task.model';
import { HouseholdMember } from '../../../models/household.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  householdId!: number;
  taskId?: number;
  isEditMode = false;
  loading = true;
  submitting = false;
  error = '';
  members: HouseholdMember[] = [];
  
  task: Partial<Task> = {
    title: '',
    description: '',
    dueDate: new Date(new Date().setHours(23, 59, 59, 999)),
    priority: 'medium',
    recurring: 'one-time',
    assignedTo: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private householdService: HouseholdService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.householdId = +params['householdId'];
      this.taskId = params['taskId'] !== 'new' ? +params['taskId'] : undefined;
      this.isEditMode = !!this.taskId;
      
      this.task.householdId = this.householdId;
      
      // Load household members for assignment dropdown
      this.loadHouseholdMembers();
      
      if (this.isEditMode) {
        this.loadTask();
      } else {
        this.loading = false;
      }
    });
  }

  loadHouseholdMembers(): void {
    this.householdService.getHouseholdDetails(this.householdId).subscribe({
      next: (response) => {
        this.members = response.members;
        
        // If this is a new task, default to assign to self
        if (!this.isEditMode) {
          const currentUserId = this.getCurrentUserId();
          if (currentUserId && !this.task.assignedTo) {
            this.task.assignedTo = currentUserId;
          }
        }
      },
      error: (err) => {
        console.error('Error loading household members', err);
        this.error = err.error?.error || 'Failed to load household members';
      }
    });
  }

  loadTask(): void {
    if (!this.taskId) return;
    
    this.taskService.getTask(this.taskId).subscribe({
      next: (response) => {
        const task = response.task;
        
        // Format date properly for input
        const dueDate = new Date(task.dueDate);
        
        // Format the date as YYYY-MM-DDThh:mm
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        const hours = String(dueDate.getHours()).padStart(2, '0');
        const minutes = String(dueDate.getMinutes()).padStart(2, '0');
        
        this.task = {
          ...task,
          dueDate: new Date(`${year}-${month}-${day}T${hours}:${minutes}`)
        };
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading task', err);
        this.error = err.error?.error || 'Failed to load task';
        this.loading = false;
      }
    });
  }

  getCurrentUserId(): number {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
    return 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.submitting = true;
    
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, this.task).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/households', this.householdId, 'tasks']);
        },
        error: (err) => {
          console.error('Error updating task', err);
          this.error = err.error?.error || 'Failed to update task';
          this.submitting = false;
        }
      });
    } else {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/households', this.householdId, 'tasks']);
        },
        error: (err) => {
          console.error('Error creating task', err);
          this.error = err.error?.error || 'Failed to create task';
          this.submitting = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.task.title?.trim()) {
      this.error = 'Title is required';
      return false;
    }
    
    if (!this.task.dueDate) {
      this.error = 'Due date is required';
      return false;
    }
    
    if (!this.task.assignedTo) {
      this.error = 'Please assign this task to someone';
      return false;
    }
    
    return true;
  }

  cancel(): void {
    this.router.navigate(['/dashboard/households', this.householdId, 'tasks']);
  }
}