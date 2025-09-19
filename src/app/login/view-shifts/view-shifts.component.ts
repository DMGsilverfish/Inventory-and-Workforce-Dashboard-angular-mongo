import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-shifts',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './view-shifts.component.html',
  styleUrls: ['./view-shifts.component.css']
})
export class ViewShiftsComponent implements OnInit {
  employeeId: number | null = null;
  employeeName: string | null = null;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.employeeName = this.route.snapshot.paramMap.get('name') ?? 'Unknown';


    console.log("Viewing shifts for ID:", this.employeeId);
  }

  goBack() {
    this.location.back();
  }
}
