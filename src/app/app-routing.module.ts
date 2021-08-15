import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  },
  {
    path: 'dashboard', component:
    DashboardLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
