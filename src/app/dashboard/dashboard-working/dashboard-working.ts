import { Component, OnInit } from '@angular/core';
import { WorkingService } from '../../working.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-working',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-working.html',
  styleUrl: './dashboard-working.css'
})
export class DashboardWorking implements OnInit {
  workingCount: number = 0;
  totalEmployees: number = 0;

  constructor(private workingService: WorkingService) {}

  ngOnInit(): void {
    this.workingService.getWorkingSummary().subscribe(summary => {
      this.workingCount = summary.workingCount;
      this.totalEmployees = summary.totalEmployees;
    });
  }
}
