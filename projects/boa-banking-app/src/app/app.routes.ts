import { Routes } from '@angular/router';
import { AuthGuard } from '../../../boa-auth/src/public-api';
import { AppShellComponent } from './shell/app-shell.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransferComponent } from './features/transfer/transfer.component';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transfer', component: TransferComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
