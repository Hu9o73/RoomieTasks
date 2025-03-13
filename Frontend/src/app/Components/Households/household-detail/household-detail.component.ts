import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HouseholdService } from '../../../Services/Households/household.service';
import { Household, HouseholdMember } from '../../../models/household.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-household-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './household-detail.component.html',
  styleUrl: './household-detail.component.css'
})
export class HouseholdDetailComponent implements OnInit {
  householdId!: number;
  household: Household | null = null;
  members: HouseholdMember[] = [];
  loading = true;
  error = '';
  
  // For household settings
  isOwner = false;
  editMode = false;
  householdName = '';
  showInviteCode = false;
  
  // Operation status
  successMessage = '';
  operationError = '';
  generating = false;
  updating = false;
  deleting = false;
  leaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private householdService: HouseholdService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.householdId = +params['id'];
      this.loadHouseholdDetails();
    });
  }

  loadHouseholdDetails(): void {
    this.loading = true;
    this.householdService.getHouseholdDetails(this.householdId).subscribe({
      next: (response) => {
        this.household = response.household;
        this.members = response.members;
        this.householdName = this.household.name;
        
        // Check if the user is the owner
        const userId = this.getUserIdFromLocalStorage();
        this.isOwner = this.household.ownerId === userId;
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading household details', err);
        this.error = err.error?.error || 'Failed to load household details';
        this.loading = false;
      }
    });
  }

  getUserIdFromLocalStorage(): number {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.id;
    }
    return -1;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.householdName = this.household?.name || '';
    }
  }

  toggleShowInviteCode(): void {
    this.showInviteCode = !this.showInviteCode;
  }

  updateHousehold(): void {
    if (!this.householdName.trim()) {
      this.operationError = 'Household name is required';
      return;
    }

    this.updating = true;
    this.operationError = '';

    this.householdService.updateHousehold(this.householdId, this.householdName).subscribe({
      next: (response) => {
        if (this.household) {
          this.household.name = response.household.name;
        }
        this.updating = false;
        this.editMode = false;
        this.successMessage = 'Household updated successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error updating household', err);
        this.operationError = err.error?.error || 'Failed to update household';
        this.updating = false;
      }
    });
  }

  generateNewInviteCode(): void {
    this.generating = true;
    this.operationError = '';

    this.householdService.generateNewInviteCode(this.householdId).subscribe({
      next: (response) => {
        if (this.household) {
          this.household.inviteCode = response.inviteCode;
        }
        this.generating = false;
        this.successMessage = 'New invite code generated';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error generating invite code', err);
        this.operationError = err.error?.error || 'Failed to generate new invite code';
        this.generating = false;
      }
    });
  }

  leaveHousehold(): void {
    if (!confirm('Are you sure you want to leave this household?')) {
      return;
    }

    this.leaving = true;
    this.operationError = '';

    this.householdService.leaveHousehold(this.householdId).subscribe({
      next: () => {
        this.leaving = false;
        this.router.navigate(['/dashboard/households']);
      },
      error: (err) => {
        console.error('Error leaving household', err);
        this.operationError = err.error?.error || 'Failed to leave household';
        this.leaving = false;
      }
    });
  }

  deleteHousehold(): void {
    if (!confirm('Are you sure you want to delete this household? This action cannot be undone.')) {
      return;
    }

    this.deleting = true;
    this.operationError = '';

    this.householdService.deleteHousehold(this.householdId).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/dashboard/households']);
      },
      error: (err) => {
        console.error('Error deleting household', err);
        this.operationError = err.error?.error || 'Failed to delete household';
        this.deleting = false;
      }
    });
  }

  copyInviteCode(): void {
    if (this.household?.inviteCode) {
      navigator.clipboard.writeText(this.household.inviteCode);
      this.successMessage = 'Invite code copied to clipboard';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }
}