import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProjectComponent } from '../project/project.component';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectListComponent } from '../project/project-list/project-list.component';
import { ProjectCreateComponent } from '../project/project-create/project-create.component';
import { ProjectDetailsComponent } from '../project/project-details/project-details.component';
import { ProjectEditComponent } from '../project/project-edit/project-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full'},
  { path: 'home', component: DashboardComponent },
  {
    path: 'project',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/project/list', pathMatch: 'full' },
      { path: 'list', component: ProjectListComponent },
      { path: 'create', component: ProjectCreateComponent },
      { path: 'details/:id', component: ProjectDetailsComponent },
      { path: 'edit/:id', component: ProjectEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
