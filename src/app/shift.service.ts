import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Shift } from "./models/shift";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private apiURL = 'http://localhost:3000/api/shifts';

  constructor(private http: HttpClient) {}

  // completed shifts
  getShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiURL}`);
  }

  // active shifts (temp.json)
  getActiveShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiURL}/active`);
  }

  // start a shift -> /api/shifts/start
  startShift(shift: Shift): Observable<Shift> {
    return this.http.post<Shift>(`${this.apiURL}/start`, shift);
  }

  // end a shift -> /api/shifts/end
  endShift(shift: Shift): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/end`, shift);
  }

  // alias kept for older code that used addShift
  addShift(shift: Shift): Observable<any> {
    return this.startShift(shift);
  }
}
