import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AdminLayoutComponent } from './login/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './login/employee-layout/employee-layout.component';
import { EmployeeComponent } from './login/employee/employee.component';
import { AdminComponent } from './login/admin/admin.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
        { path: '', component: AdminComponent } // default admin page
    ]
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    children: [
        { path: '', component: EmployeeComponent } // default employee page
    ]
  }
];
