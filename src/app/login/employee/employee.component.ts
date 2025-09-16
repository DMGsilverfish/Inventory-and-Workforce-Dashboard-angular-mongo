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
export class EmployeeComponent implements OnInit{
  currentShift: Shift | null = null;
  shiftStarted = false;
  userId: number | null = null;
  numShiftsToday: number = 0;

  constructor(private authService: AuthService, private shiftService: ShiftService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log("Employee logged in with ID:", this.userId);
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
      id: this.userId!, //change this
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().split(' ')[0].substring(0,5)
    };
    this.shiftStarted = true;
    this.numShiftsToday += 1;
  }

  stopShift() {
    if (this.currentShift) {
      const now = new Date();
      this.currentShift.endTime = now.toTimeString().split(' ')[0].substring(0,5);
      this.shiftStarted = false;

      //Later save to file / API
      console.log('Shift completed: ', this.currentShift);
      console.log('Total shifts today: ', this.numShiftsToday);
      this.loadShifts(this.currentShift);
    }
  }

  loadShifts(shift: Shift) {
    this.shiftService.addShift(shift).subscribe({
      next: (res) => {
        console.log('Shift saved successfully:', res);
      },
      error: (err) => {
        console.error('Error saving shift:', err);
      }
    })
  }
}
