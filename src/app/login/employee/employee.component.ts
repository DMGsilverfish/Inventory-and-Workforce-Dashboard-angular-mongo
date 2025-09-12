import { Component, OnInit } from '@angular/core';
import { Shift } from '../../models/shift';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-employee',
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  currentShift: Shift | null = null;
  shiftStarted = false;
  userId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
  this.userId = this.authService.getUserId();
  console.log("Employee logged in with ID:", this.userId);
  }

  startShift() {
    if (!this.userId) {
      console.error("Cannot start shift: user ID not available");
      return;
    }

    const now = new Date();
    this.currentShift = {
      id: this.userId!, //change this
      date: now.toISOString().split('T')[0],
      startTime: now.toTimeString().split(' ')[0].substring(0,5)
    };
    this.shiftStarted = true;
  }

  stopShift() {
    if (this.currentShift) {
      const now = new Date();
      this.currentShift.endTime = now.toTimeString().split(' ')[0].substring(0,5);
      this.shiftStarted = false;

      //Later save to file / API
      console.log('Shift completed: ', this.currentShift);
    }
  }
}
