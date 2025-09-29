import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { StockItem } from "../app/models/stock-item.model";

@Injectable({
    providedIn: 'root'
})
export class StockService {
    private apiURL = 'http://localhost:3000/api/stock';

    constructor(private http: HttpClient) {}

    getStock(): Observable<StockItem[]> {
        return this.http.get<StockItem[]>(this.apiURL);
    }

    getStockSummary(): Observable<{ inStockCount: number; totalItems: number; inStockPercentage: number }> {
        return this.http.get<{ inStockCount: number; totalItems: number; inStockPercentage: number }>(
            `${this.apiURL}/summary`
        );
    }
}