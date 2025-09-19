import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShiftService } from '../../shift.service';
import { Shift } from '../../models/shift';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-view-shifts',
  imports: [CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './view-shifts.component.html',
  styleUrls: ['./view-shifts.component.css'],
  providers: [ShiftService]
})
export class ViewShiftsComponent implements OnInit {
  employeeId: number | null = null;
  employeeName: string | null = null;
  shifts: Shift[] = [];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private shiftService: ShiftService
  ) {}

  ngOnInit() {
  this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
  this.employeeName = this.route.snapshot.paramMap.get('name') ?? 'Unknown';

  if (this.employeeId) {
    this.shiftService.getUserShifts(this.employeeId).subscribe({
      next: (data) => {
        this.shifts = data;
        console.log("Loaded shifts:", this.shifts);
      },
      error: (err) => console.error("Error loading user shifts:", err)
    });
  }
}


  loadShifts(userId: number) {
    this.shiftService.getUserShifts(userId).subscribe({
      next: (data) => {
        this.shifts = data;
        console.log("Shifts loaded:", this.shifts);
      },
      error: (err) => console.error("Error loading shifts:", err)
    });
  }

  goBack() {
    this.location.back();
  }
}
