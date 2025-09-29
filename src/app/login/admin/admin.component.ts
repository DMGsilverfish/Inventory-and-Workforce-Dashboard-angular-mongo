import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardStock } from "../../dashboard/dashboard-stock/dashboard-stock";
import { AdminEmployeeListComponent } from "./admin-employee-list/admin-employee-list.component";
import { DashboardWorking } from "../../dashboard/dashboard-working/dashboard-working";

interface Employee {
  id: number;
  name: string;
  pin: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DashboardStock, RouterModule, AdminEmployeeListComponent, DashboardWorking],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    
    this.http.get<Employee[]>('/employee.json').subscribe({
      next: (data) => {
        this.employees = data;
        console.log("Employees loaded:", this.employees);
      },
      error: (err) => console.error("Error loading employees:", err)
    });
  }
}
