import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';

interface IRow {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [FormsModule, CommonModule, AgGridAngular],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css',
})
export class AdminDashComponent {
  targetId: string = '';
  targetRole: string = '';
  errorMessage: string = '';
  successMesssage: string = '';

  public theme = themeQuartz;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  rowData: IRow[] = [];

  colDefs: ColDef[] = [
    { field: 'id', filter: true },
    { field: 'firstName', filter: true },
    { field: 'lastName', filter: true },
    { field: 'role', filter: true}
  ];

  defaultColDef: ColDef = {
    flex: 1,
  };


  onGridReady(params: GridReadyEvent) {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe(
      (data) => {
        this.rowData = data; // Assign fetched data to rowData
      },
      (error) => {
        this.errorMessage = 'Failed to load data';
        console.error(error);
      }
    );
  }
}
