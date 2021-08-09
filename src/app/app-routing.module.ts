import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'project',
    component: ProjectComponent,
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
