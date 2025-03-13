import { Component, OnInit } from '@angular/core';
import { HouseholdService } from '../../../Services/Households/household.service';
import { Household } from '../../../models/household.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-household-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './household-list.component.html',
  styleUrl: './household-list.component.css'
})
export class HouseholdListComponent implements OnInit {
  households: Household[] = [];
  loading = true;
  error = '';
  
  // For creating new household
  newHouseholdName = '';
  creatingHousehold = false;
  createError = '';
  
  // For joining household
  inviteCode = '';
  joiningHousehold = false;
  joinError = '';

  constructor(
    private householdService: HouseholdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHouseholds();
  }

  loadHouseholds(): void {
    this.loading = true;
    this.error = '';
    console.log('Loading households...');
    
    this.householdService.getHouseholds().subscribe({
      next: (response) => {
        console.log('Households loaded successfully:', response);
        this.households = response.households;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading households', err);
        this.error = `Failed to load households: ${err.status} ${err.statusText}`;
        if (err.error && err.error.error) {
          this.error += ` - ${err.error.error}`;
        }
        this.loading = false;
      }
    });
  }

  createHousehold(): void {
    if (!this.newHouseholdName.trim()) {
      this.createError = 'Household name is required';
      return;
    }

    this.creatingHousehold = true;
    this.createError = '';

    this.householdService.createHousehold(this.newHouseholdName).subscribe({
      next: (response) => {
        this.households.push(response.household);
        this.newHouseholdName = '';
        this.creatingHousehold = false;
      },
      error: (err) => {
        console.error('Error creating household', err);
        this.createError = err.error?.error || 'Failed to create household';
        this.creatingHousehold = false;
      }
    });
  }

  joinHousehold(): void {
    if (!this.inviteCode.trim()) {
      this.joinError = 'Invite code is required';
      return;
    }

    this.joiningHousehold = true;
    this.joinError = '';

    this.householdService.joinHousehold(this.inviteCode).subscribe({
      next: (response) => {
        this.households.push(response.household);
        this.inviteCode = '';
        this.joiningHousehold = false;
      },
      error: (err) => {
        console.error('Error joining household', err);
        this.joinError = err.error?.error || 'Failed to join household';
        this.joiningHousehold = false;
      }
    });
  }

  viewHousehold(id: number): void {
    this.router.navigate(['/dashboard/households', id]);
  }
}