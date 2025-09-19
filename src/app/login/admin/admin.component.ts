import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Employee {
  id: number;
  name: string;
  pin: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
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

  viewShifts(id: number, name: string): void {
    this.router.navigate(['/admin/viewShifts', id, name]);
  }
}
