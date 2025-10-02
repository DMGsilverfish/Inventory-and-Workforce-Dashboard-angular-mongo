import { Component, OnInit } from '@angular/core';
import { StockItem } from '../../../models/stock-item.model';
import { StockService } from '../../../stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-load-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './load-stock.component.html',
  styleUrl: './load-stock.component.css'
})
export class LoadStockComponent implements OnInit {
  stockItems: StockItem[] = [];
  loading = true;
  error: string | null = null;

  //modal state
  showModal = false;
  selectedItem: StockItem | null = null;
  addAmount: number = 0;
  validationError: string | null = null;

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

  openModal(item: StockItem) {
    this.showModal = true;
    this.selectedItem = item;
    this.addAmount = 0;
    this.validationError = null;
  }

  closeModal() {
    this.showModal = false;
    this.selectedItem = null;
    this.addAmount = 0;
  }

  confirmAdd() {
    if (!this.selectedItem) return;

    const newTotal = this.selectedItem.quantity + this.addAmount;

    if (newTotal > this.selectedItem['full-stock']) {
      this.validationError = `Cannot exceed full stock of ${this.selectedItem['full-stock']}.`;
      return;
    }

    this.stockService.updateStockItem(this.selectedItem.id, { quantity: newTotal }).subscribe({
      next: (updated) => {
        this.selectedItem!.quantity = updated.quantity;
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating stock item', err);
        this.validationError = 'Error updating stock item.';
      }
    });

  }
}
