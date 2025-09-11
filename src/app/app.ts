import { Component, signal } from '@angular/core';
import { Header } from "./header/header";
import { DashboardStock } from "./dashboard/dashboard-stock/dashboard-stock";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Header, DashboardStock, RouterOutlet]
})
export class App {
  
}
