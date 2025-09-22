import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShiftService } from '../../shift.service';
import { Shift } from '../../models/shift';
import { HttpClientModule } from '@angular/common/http';
import { ViewShiftsGraphComponent } from './view-shifts-graph/view-shifts-graph..component';
import { ViewShiftsTableComponent } from './view-shifts-table/view-shifts-table.component';


@Component({
  selector: 'app-view-shifts',
  imports: [CommonModule, HttpClientModule, ViewShiftsTableComponent, ViewShiftsGraphComponent],
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

    if (this.employeeId) {
      this.shiftService.getUserShifts(this.employeeId).subscribe({
        next: (data) => (this.shifts = data),
        error: (err) => console.error("Error loading user shifts:", err)
      });

      this.shiftService.getUserName(this.employeeId).subscribe({
        next: (data) => (this.employeeName = data.name),
        error: (err) => console.error("Error loading employee name:", err)
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
