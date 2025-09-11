import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../header/header'; // adjust path if needed

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {}
