import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Shift } from '../../../models/shift.model';


@Component({
  selector: 'app-view-shifts-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-shifts-table.component.html',
  styleUrl: './view-shifts-table.component.css'
})
export class ViewShiftsTableComponent {
  @Input() shifts: Shift[] = []
}
