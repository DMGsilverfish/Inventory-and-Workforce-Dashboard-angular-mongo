import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AdminComponent } from './login/admin/admin.component';
import { EmployeeComponent } from './login/employee/employee.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'employee', component: EmployeeComponent }
];
