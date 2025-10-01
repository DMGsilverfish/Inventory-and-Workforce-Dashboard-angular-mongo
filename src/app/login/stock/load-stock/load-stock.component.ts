import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-load-stock',
  standalone: true,
  imports: [],
  templateUrl: './load-stock.component.html',
  styleUrl: './load-stock.component.css'
})
export class LoadStockComponent implements OnInit {
  stock: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
      this.http.get<any[]>('http://localhost:3000/stock')
        .subscribe(data => {
          this.stock = data;
        });
  }
}
