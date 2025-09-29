import { Component, OnInit } from '@angular/core';
import { StockService } from '../../stock.service';
import { StockItem } from '../../models/stock-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stock.html',
  styleUrl: './dashboard-stock.css'
})
export class DashboardStock implements OnInit {
  stockItems: StockItem[] = [];
  inStockCount: number = 0;
  totalItems: number = 0;
  inStockPercentage: number = 0;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
      this.stockService.getStock().subscribe((data: StockItem[]) => {
          this.stockItems = data;
      });

      this.stockService.getStockSummary().subscribe(summary => {
        this.inStockCount = summary.inStockCount;
        this.totalItems = summary.totalItems;
        this.inStockPercentage = summary.inStockPercentage;
      });
  }

}
