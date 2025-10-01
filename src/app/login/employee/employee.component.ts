import { Component, OnInit } from '@angular/core';
import { Shift } from '../../models/shift.model';
import { AuthService } from '../../auth.service';
import { ShiftService } from '../../shift.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  imports: [CommonModule, HttpClientModule],
  providers: [ShiftService],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  currentShift: Shift | null = null;
  shiftStarted = false;
  userId: number | null = null;
  numShiftsToday: number = 0;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log("Employee logged in with ID:", this.userId);

    if (this.userId) {
      // ✅ Get completed shifts
      this.shiftService.getNumShiftsToday(this.userId).subscribe({
        next: (res) => {
          this.numShiftsToday = res.count;
          console.log("Completed shifts today:", this.numShiftsToday);

          // ✅ Now check if there's an active shift
          this.shiftService.getActiveShifts().subscribe({
            next: (activeShifts) => {
              const userShift = activeShifts.find((s: Shift) => s.id === this.userId);
              if (userShift) {
                this.currentShift = userShift;
                this.shiftStarted = true;

                // 🚀 Add active shift into the count
                this.numShiftsToday = res.count + 1;

                console.log("Active shift loaded:", this.currentShift);
                console.log("Num Shifts today (including active):", this.numShiftsToday);
              }
            },
            error: (err) => console.error("Error fetching active shifts:", err)
          });
        },
        error: (err) => console.error("Error fetching shift count:", err)
      });
    }
  }



  startShift() {
    console.log("Attempting to start shift for user ID:", this.userId);
    if (!this.userId) {
      console.error("Cannot start shift: user ID not available");
      return;
    }
    if (this.numShiftsToday >= 2) {
      alert("You have reached the maximum of 2 shifts for today.");
      return;
    }

    const now = new Date();
    this.currentShift = {
      id: this.userId!,
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().split(' ')[0].substring(0, 5)
    };
    this.shiftStarted = true;
    
    this.numShiftsToday += 1;
    console.log("Num Shifts today" + this.numShiftsToday)

    this.shiftService.startShift(this.currentShift).subscribe({
      next: (res) => console.log('Shift started and saved:', res),
      error: (err) => console.error('Error starting shift:', err)
    });
  }

  stopShift() {
    if (this.currentShift) {
      const now = new Date();
      const endTime = now.toTimeString().split(' ')[0].substring(0, 5);

      this.shiftService.endShift(this.currentShift.id, { endTime }).subscribe({
        next: (res) => {
          console.log("Shift ended & saved:", res);
          this.currentShift = null;
          this.shiftStarted = false;
        },
        error: (err) => console.error("Error ending shift:", err)
      });
    }
  }
}
