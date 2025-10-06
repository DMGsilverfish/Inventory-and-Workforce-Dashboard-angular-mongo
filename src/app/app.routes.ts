import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AdminLayoutComponent } from './login/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './login/employee-layout/employee-layout.component';
import { EmployeeComponent } from './login/employee/employee.component';
import { AdminComponent } from './login/admin/admin.component';
import { AuthGuard } from './auth-guard';
import { ViewShiftsComponent } from './login/view-shifts/view-shifts.component';
import { LoadStockComponent } from './login/stock/load-stock/load-stock.component';
import { AddItemComponent } from './login/stock/add-item/add-item.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', component: AdminComponent }, // default admin page
        { path: 'viewShifts/:id',
          component: ViewShiftsComponent } // /admin/viewShifts/1
    ]
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', component: EmployeeComponent }, // default employee page
        { path: 'load-stock', component: LoadStockComponent },
        { path: 'stock/add-item', component: AddItemComponent}
    ]
  }
];
