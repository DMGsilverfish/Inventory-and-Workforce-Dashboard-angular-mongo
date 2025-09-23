import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ShiftService } from '../../shift.service';
import { Shift } from '../../models/shift';
import { HttpClientModule } from '@angular/common/http';
import { ViewShiftsGraphComponent } from './view-shifts-graph/view-shifts-graph.component';
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
  filteredShifts: Shift[] = [];

  constructor(private route: ActivatedRoute,
              private location: Location,
              private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.employeeId) {
      this.shiftService.getUserShifts(this.employeeId).subscribe({
        next: (data) => { this.shifts = data;
                          this.filteredShifts = data;
        },
        error: (err) => console.error("Error loading user shifts:", err)
      });

      this.shiftService.getUserName(this.employeeId).subscribe({
        next: (data) => (this.employeeName = data.name),
        error: (err) => console.error("Error loading employee name:", err)
      });
    }
  }

  setFilter(range: 'week' | 'month') {
    const now = new Date();

    this.filteredShifts = this.shifts.filter((shift) => {
      const shiftDate = new Date(shift.date);

      if (range === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return shiftDate >= oneWeekAgo && shiftDate <= now;
      }

      if (range === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        return shiftDate >= oneMonthAgo && shiftDate <= now;
      }

      return true;
    });
  }

  goBack() {
    this.location.back();
  }
}
