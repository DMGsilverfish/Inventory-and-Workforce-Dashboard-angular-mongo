import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
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

    this.http.get<any[]>('/admin.json').subscribe(admins => {
      const admin = admins.find(a => a.name === this.username && a.pin === this.password);
      if (admin) {
        this.authService.login('admin');
        this.router.navigate(['./admin']);
      } else {
        this.http.get<any[]>('/employee.json').subscribe(employees => {
          const employee = employees.find(e => e.name === this.username && e.pin === this.password);
          if (employee) {
            this.authService.login('employee');
            this.router.navigate(['./employee']);
          } else {
            alert('Invalid username or pin');
          }
        })
      }
    })
  }
}
