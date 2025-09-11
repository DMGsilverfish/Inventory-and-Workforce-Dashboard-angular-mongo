import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../header/header';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {

}
