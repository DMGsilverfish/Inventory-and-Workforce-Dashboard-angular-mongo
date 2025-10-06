import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockItem } from '../../../models/stock-item.model';
import { StockService } from '../../../stock.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-item.component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  newItem: Partial<StockItem> = {
    type: '',
    name: '',
    quantity: 0,
    ['full-stock']: 0,
    price: 0,
    brand: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;
  loading = false;

  constructor(private stockService: StockService) {}

  addItem() {
    this.successMessage = null;
    this.errorMessage = null;
    this.loading = true;

    this.stockService.addStockItem(this.newItem as StockItem).subscribe({
      next: () => {
        this.successMessage = 'Item added successfully!';
        this.newItem = { type: '', name: '', quantity: 0, ['full-stock']: 0, price: 0, brand: '' };
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error adding item. Please try again.';
        this.loading = false;
        console.error(err);
      }
    });
  }

}
