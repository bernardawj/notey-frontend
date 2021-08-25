import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInGuard } from './auth/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/project/list', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule)
  },
  { path: '**', redirectTo: '/dashboard/project/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
