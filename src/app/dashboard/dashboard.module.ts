import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import { ProjectComponent } from '../project/project.component';
import { RecentProjectComponent } from '../project/recent-project/recent-project.component';
import { ProjectListComponent } from '../project/project-list/project-list.component';
import { ProjectListItemComponent } from '../project/project-list-item/project-list-item.component';
import { ProjectFormComponent } from '../project/project-form/project-form.component';
import { ProjectCreateComponent } from '../project/project-create/project-create.component';
import { ProjectDetailsComponent } from '../project/project-details/project-details.component';
import { ProjectEditComponent } from '../project/project-edit/project-edit.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectComponent,
    RecentProjectComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectFormComponent,
    ProjectCreateComponent,
    ProjectDetailsComponent,
    ProjectEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule
  ],
  providers: []
})
export class DashboardModule {
}
