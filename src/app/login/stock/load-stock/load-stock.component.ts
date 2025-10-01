import { Component, OnInit } from '@angular/core';
import { StockItem } from '../../../models/stock-item.model';
import { StockService } from '../../../stock.service';

@Component({
  selector: 'app-load-stock',
  standalone: true,
  imports: [],
  templateUrl: './load-stock.component.html',
  styleUrl: './load-stock.component.css'
})
export class LoadStockComponent implements OnInit {
  stockItems: StockItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock() {
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stockItems = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading stock data';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
