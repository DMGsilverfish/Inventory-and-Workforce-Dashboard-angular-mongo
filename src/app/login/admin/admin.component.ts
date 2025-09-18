import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Employee {
  id: number;
  name: string;
  pin: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.http.get<Employee[]>('/employee.json').subscribe({
        next: (data) => {
          this.employees = data;
          console.log("Employees loaded:", this.employees);
        },
        error: (err) => console.error("Error loading employees:", err)
      });
  }

  viewShifts(employee: Employee): void {
    console.log(`Viewing shifts for ${employee.name} (ID: ${employee.id})`);
    // Implement navigation to shift details page if needed
  }
}
