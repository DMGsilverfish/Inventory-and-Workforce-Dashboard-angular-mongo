import { Component, OnInit } from '@angular/core';
import { StockItem } from '../../../models/stock-item.model';
import { StockService } from '../../../stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-load-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './load-stock.component.html',
  styleUrl: './load-stock.component.css'
})
export class LoadStockComponent implements OnInit {
  stockItems: StockItem[] = [];
  groupedStock: { [key: string]: StockItem[] } = {};
  loading = true;
  error: string | null = null;

  //modal state
  showModal = false;
  selectedItem: StockItem | null = null;
  addAmount: number = 0;
  validationError: string | null = null;

  //search state
  searchTerm: string = '';
  filteredStock: StockItem[] = [];

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.loadStock();
  }

  loadStock() {
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stockItems = data;
        this.filteredStock = data;
        this.groupedStock = this.groupByType(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading stock data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private groupByType(stock: StockItem[]): { [key: string]: StockItem[] } {
    return stock.reduce((groups, item) => {
      const type = item.type || 'Other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
      return groups;
    }, {} as { [key: string]: StockItem[] });
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

  showDeleteConfirm = false;
  itemToDelete: StockItem | null = null;

  openDeleteModal(item: StockItem) {
    this.itemToDelete = item;
    this.showDeleteConfirm = true;
  }

  closeDeleteModal() {
    this.showDeleteConfirm = false;
    this.itemToDelete = null;
  }

  confirmDelete() {
    if (!this.itemToDelete) return;

    this.stockService.deleteStockItem(this.itemToDelete.id).subscribe({
      next: () => {
        this.stockItems = this.stockItems.filter(s => s.id !== this.itemToDelete?.id);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error("Error deleting item:", err);
        this.error = "Failed to delete stock item.";
        this.closeDeleteModal();
      }
    });
  }

  //search logic
  filterStock() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      // Reset to full data when search is cleared
      this.groupedStock = this.groupByType(this.stockItems);
      return;
    }

    // Filter the full list
    const filtered = this.stockItems.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.brand.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );

    // Regroup filtered items
    this.groupedStock = this.groupByType(filtered);
    }
}


