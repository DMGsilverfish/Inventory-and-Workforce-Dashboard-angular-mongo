import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Shift } from "./models/shift";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private apiURL = 'http://localhost:3000/api/shifts';

  constructor(private http: HttpClient) {}

  // Get completed shifts
  getShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiURL);
  }

  // Get active shifts
  getActiveShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiURL}?status=active`);
  }

  // Start a new shift
  startShift(shift: Shift): Observable<Shift> {
    return this.http.post<Shift>(this.apiURL, shift);
  }

  // End an existing shift
  endShift(shiftId: number, updates: Partial<Shift>): Observable<Shift> {
    return this.http.patch<Shift>(`${this.apiURL}/${shiftId}`, updates);
  }

  // Optional: delete a shift (admin usage)
  deleteShift(shiftId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${shiftId}`);
  }

  
getNumShiftsToday(userId: number) {
  return this.http.get<{ count: number }>(`http://localhost:3000/shifts/count/${userId}`);
}


// Get all shifts for a specific user
getUserShifts(userId: number): Observable<Shift[]> {
  return this.http.get<Shift[]>(`${this.apiURL}/user/${userId}`);
}


}
