import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private role: 'admin' | 'employee' | null = null;

  login(role: 'admin' | 'employee') {
    this.isLoggedIn = true;
    this.role = role;
  }

  logout() {
    this.isLoggedIn = false;
    this.role = null;
  }

  userIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getUserRole(): 'admin' | 'employee' | null {
    return this.role;
  }
}

