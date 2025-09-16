import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Shift } from "./models/shift";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ShiftService {
    private apiURL = 'api/shifts';

    constructor(private http: HttpClient) {}

    addShift(shift: Shift): Observable<any> {
        return this.http.post(this.apiURL, shift);
    }

    getShifts(): Observable<Shift[]> {
        return this.http.get<Shift[]>(this.apiURL);
    }
}