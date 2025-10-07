import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  login() {
    if (!this.username || !this.password) {
      alert('Please enter a username and pin');
      return;
    }

    this.http.get<any[]>('http://localhost:3000/api/admin').subscribe(admins => {
      const admin = admins.find(a => a.name === this.username && a.pin === this.password);
      if (admin) {
        this.authService.setUserId(admin.id);
        this.authService.login('admin');    
        this.router.navigate(['./admin']);
      } else {
        this.http.get<any[]>('http://localhost:3000/api/employee').subscribe(employees => {
          const employee = employees.find(e => e.name === this.username && e.pin === this.password);
          if (employee) {
            this.authService.setUserId(employee.id);
            this.authService.login('employee');
            this.router.navigate(['./employee']);
          } else {
            alert('Invalid username or pin');
          }
        });
      }
    });

  }
}
