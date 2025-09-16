import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private role: 'admin' | 'employee' | null = null;
  private userId: number | null = null;

  constructor() { 
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.role = localStorage.getItem('role') as 'admin' | 'employee' | null;
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? Number(storedId) : null;
  }

  login(role: 'admin' | 'employee') {
    this.isLoggedIn = true;
    this.role = role;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', role);
    console.log(`User logged in as ${role}`);
  }

  logout() {
    console.log("User logged out");
    this.isLoggedIn = false;
    this.role = null;
    this.userId = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  userIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  getUserRole(): 'admin' | 'employee' | null {
    return this.role;
  }

  //storing the user
  setUserId(id: number) {
    this.userId = id;
    localStorage.setItem('userId', id.toString());
  }

  getUserId(): number | null {
    return this.userId;
  }

  clearUser() {
    console.log("Clearing user ID");
    this.userId = null;
    localStorage.removeItem('userId');
  }
}

