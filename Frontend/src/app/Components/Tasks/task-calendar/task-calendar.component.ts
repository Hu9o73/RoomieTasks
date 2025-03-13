import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../Services/Tasks/task.service';
import { HouseholdService } from '../../../Services/Households/household.service';
import { Task } from '../../../models/task.model';
import { Household } from '../../../models/household.model';

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './task-calendar.component.html',
  styleUrl: './task-calendar.component.css'
})
export class TaskCalendarComponent implements OnInit {
  tasks: Task[] = [];
  households: Household[] = [];
  selectedHouseholdId: number | null = null;
  calendarDays: any[] = [];
  currentDate = new Date();
  currentMonth: number;
  currentYear: number;
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  loading = true;
  error = '';

  constructor(
    private taskService: TaskService,
    private householdService: HouseholdService
  ) {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
  }

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
        this.generateCalendar();
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

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  generateCalendar(): void {
    this.calendarDays = [];
    
    // First day of the month
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    // Last day of the month
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Add empty slots for days before the first day of the month
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({ day: null, tasks: [] });
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      
      // Find tasks for this day
      const dayTasks = this.tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getDate() === day && 
               taskDate.getMonth() === this.currentMonth && 
               taskDate.getFullYear() === this.currentYear;
      });
      
      this.calendarDays.push({
        day,
        date,
        isToday: this.isToday(date),
        tasks: dayTasks
      });
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'bg-danger';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getRecurringIcon(recurring: string): string {
    switch(recurring) {
      case 'daily': return 'fa-rotate';
      case 'weekly': return 'fa-calendar-week';
      case 'monthly': return 'fa-calendar-days';
      default: return '';
    }
  }

  getRecurringText(recurring: string): string {
    switch(recurring) {
      case 'daily': return 'Repeats daily';
      case 'weekly': return 'Repeats weekly';
      case 'monthly': return 'Repeats monthly';
      default: return 'One-time task';
    }
  }
}