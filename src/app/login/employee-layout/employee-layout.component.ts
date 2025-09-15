import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../header/header';
import { ShiftInfo } from "../../shift-info/shift-info.component";

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, Header, ShiftInfo],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {
  headerText: string = "Employee Shifts";
}
