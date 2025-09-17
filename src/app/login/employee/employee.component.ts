import { Component, OnInit } from '@angular/core';
import { Shift } from '../../models/shift';
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

  constructor(private authService: AuthService, private shiftService: ShiftService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log("Employee logged in with ID:", this.userId);

    if (this.userId) {
      // restore active shifts (temp.json)
      this.shiftService.getActiveShifts().subscribe({
        next: (activeShifts) => {
          const userShift = activeShifts.find((s: Shift) => s.id === this.userId);
          if (userShift) {
            this.currentShift = userShift;
            this.shiftStarted = true;
            console.log("Restored active shift:", this.currentShift);
          }
        },
        error: (err) => console.error('Error fetching active shifts:', err)
      });

      // optional: calculate how many shifts this user has already completed today
      // so the numShiftsToday logic works correctly (prevents > 2 shifts)
      const today = new Date().toISOString().split('T')[0];
      this.shiftService.getShifts().subscribe({
        next: (completedShifts) => {
          this.numShiftsToday = completedShifts.filter((s: Shift) => s.id === this.userId && s.date === today).length;
          console.log('Shifts today (completed):', this.numShiftsToday);
        },
        error: (err) => console.error('Error fetching completed shifts:', err)
      });
    }
  }

  startShift() {
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
      startTime: now.toTimeString().split(' ')[0].substring(0,5)
    };
    this.shiftStarted = true;
    this.numShiftsToday += 1;

    // save to backend (temp.json) — uses guarded /start endpoint
    this.shiftService.startShift(this.currentShift).subscribe({
      next: (res) => {
        console.log('Shift started and saved:', res);
      },
      error: (err) => {
        this.shiftStarted = false;
        this.numShiftsToday = Math.max(0, this.numShiftsToday - 1);
        console.error('Error starting shift:', err);
        if (err && err.status === 409) {
          alert('Cannot start: you already have an active shift (restored on next load).');
        }
      }
    });
  }

  stopShift() {
    if (this.currentShift) {
      const now = new Date();
      this.currentShift.endTime = now.toTimeString().split(' ')[0].substring(0,5);
      this.shiftStarted = false;

      // Later save to file / API
      console.log('Shift completed: ', this.currentShift);
      console.log('Total shifts today: ', this.numShiftsToday);

      // call separate method to persist the ended shift
      this.loadShifts(this.currentShift);

      // clear in-memory now (we already sent it for saving)
      this.currentShift = null;
    }
  }

  loadShifts(shift: Shift) {
    // use endShift to move from temp.json -> employee-shifts.json
    this.shiftService.endShift(shift).subscribe({
      next: (res) => console.log("Shift ended & saved to employee-shifts.json:", res),
      error: (err) => console.error("Error ending shift:", err)
    });
  }
}
