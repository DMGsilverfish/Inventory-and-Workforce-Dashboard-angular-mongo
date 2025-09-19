import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Employee {
  id: number;
  name: string;
  pin: string;
}

@Component({
  selector: 'app-admin-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-employee-list.component.html',
  styleUrls: ['./admin-employee-list.component.css']
})
export class AdminEmployeeListComponent {
  @Input() employees: Employee[] = [];

  constructor(private router: Router) {}

  viewShifts(emp: Employee) {
    this.router.navigate([`/admin/viewShifts`, emp.id]);
  }
}
