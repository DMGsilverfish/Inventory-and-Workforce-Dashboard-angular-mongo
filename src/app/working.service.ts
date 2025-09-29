import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkingService {
  private apiUrl = 'http://localhost:3000/api/working';

  constructor(private http: HttpClient) {}

  getWorkingSummary(): Observable<{ workingCount: number; totalEmployees: number }> {
    return this.http.get<{ workingCount: number; totalEmployees: number }>(
      `${this.apiUrl}/summary`
    );
  }
}
