import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StockItem } from '../../models/stock-item.model';

@Component({
  selector: 'app-dashboard-stock',
  imports: [],
  templateUrl: './dashboard-stock.html',
  styleUrl: './dashboard-stock.css'
})
export class DashboardStock implements OnInit {
  stockItems: StockItem[] = [];
  inStockCount: number = 0;
  totalItems: number = 0;
  inStockPercentage: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      this.http.get<StockItem[]>('/stock.json').subscribe((data) => {
        this.stockItems = data;
        this.totalItems = data.length;
        this.calculateInStock();
      })
  }

  private calculateInStock(): void {
    this.inStockCount = this.stockItems.filter(item =>
      item.quantity >= item['full-stock'] * 0.75
    ).length;

    this.inStockPercentage = Math.round(
      (this.inStockCount / this.totalItems) * 100
    );
  }
}
