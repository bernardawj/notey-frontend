import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { RecentProjectComponent } from './project/recent-project/recent-project.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectListItemComponent } from './project/project-list-item/project-list-item.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { ProjectEditComponent } from './project/project-edit/project-edit.component';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    ProjectComponent,
    RecentProjectComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectFormComponent,
    ProjectCreateComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    NotificationComponent
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }]
})
export class DashboardModule {
}
