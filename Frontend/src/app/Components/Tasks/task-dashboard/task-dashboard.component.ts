import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Services/Tasks/task.service';
import { HouseholdService } from '../../../Services/Households/household.service';
import { Task } from '../../../models/task.model';
import { Household } from '../../../models/household.model';

@Component({
  selector: 'app-task-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-dashboard.component.html',
  styleUrl: './task-dashboard.component.css'
})
export class TaskDashboardComponent implements OnInit {
  tasks: Task[] = [];
  households: Household[] = [];
  selectedHouseholdId: number | null = null;
  loading = true;
  error = '';
  
  // Chart data
  priorityData = [0, 0, 0]; // high, medium, low
  statusData = [0, 0]; // pending, completed

  constructor(
    private taskService: TaskService,
    private householdService: HouseholdService
  ) {}

  ngOnInit(): void {
    this.loadHouseholds();
  }

  loadHouseholds(): void {
    this.householdService.getHouseholds().subscribe({
      next: (response) => {
        this.households = response.households;
        if (this.households.length > 0) {
          this.selectedHouseholdId = this.households[0].id;
          this.loadTasks();
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading households', err);
        this.error = err.error?.error || 'Failed to load households';
        this.loading = false;
      }
    });
  }

  loadTasks(): void {
    if (!this.selectedHouseholdId) return;
    
    this.loading = true;
    this.taskService.getHouseholdTasks(this.selectedHouseholdId).subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.updateChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.error = err.error?.error || 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  onHouseholdChange(): void {
    this.loadTasks();
  }

  updateChartData(): void {
    // Reset data
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    const statusCounts = { pending: 0, completed: 0 };
    
    // Count tasks by priority and status
    this.tasks.forEach(task => {
      // Count by priority
      if (priorityCounts.hasOwnProperty(task.priority)) {
        priorityCounts[task.priority]++;
      }
      
      // Count by status
      if (statusCounts.hasOwnProperty(task.status)) {
        statusCounts[task.status]++;
      }
    });
    
    // Update chart data
    this.priorityData = [
      priorityCounts.high,
      priorityCounts.medium, 
      priorityCounts.low
    ];
    
    this.statusData = [
      statusCounts.pending,
      statusCounts.completed
    ];
  }

  // Helper methods for SVG pie charts
  getPriorityPieSegment(index: number): string {
    const total = this.priorityData.reduce((sum, count) => sum + count, 0);
    if (total === 0) return "0 251.2";
    
    const percentage = this.priorityData[index] / total;
    const dashLength = percentage * 251.2; // Circumference of circle with r=40 (2πr ≈ 251.2)
    return `${dashLength} ${251.2 - dashLength}`;
  }
  
  getPriorityPieOffset(index: number): string {
    const total = this.priorityData.reduce((sum, count) => sum + count, 0);
    if (total === 0) return "0";
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.priorityData[i] / total) * 251.2;
    }
    return `-${offset}`;
  }
  
  getStatusPieSegment(index: number): string {
    const total = this.statusData.reduce((sum, count) => sum + count, 0);
    if (total === 0) return "0 251.2";
    
    const percentage = this.statusData[index] / total;
    const dashLength = percentage * 251.2;
    return `${dashLength} ${251.2 - dashLength}`;
  }
  
  getStatusPieOffset(index: number): string {
    const total = this.statusData.reduce((sum, count) => sum + count, 0);
    if (total === 0) return "0";
    
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (this.statusData[i] / total) * 251.2;
    }
    return `-${offset}`;
  }
  
  getTotalTasks(): number {
    return this.tasks.length;
  }
  
  getCompletedTasksPercentage(): number {
    if (this.tasks.length === 0) return 0;
    const completed = this.tasks.filter(task => task.status === 'completed').length;
    return Math.round((completed / this.tasks.length) * 100);
  }
  
  getPendingTasksCount(): number {
    return this.tasks.filter(task => task.status === 'pending').length;
  }
  
  getHighPriorityTasksCount(): number {
    return this.tasks.filter(task => task.priority === 'high' && task.status === 'pending').length;
  }
}