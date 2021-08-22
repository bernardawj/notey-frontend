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
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskListItemComponent } from './task/task-list-item/task-list-item.component';
import { AssignUserComponent } from './project/assign-user/assign-user.component';
import { RenameTaskTypePipe } from './task/rename-task-type.pipe';
import { CreditsComponent } from './credits/credits.component';
import { TaskCreateComponent } from './task/task-create/task-create.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskEditComponent } from './task/task-edit/task-edit.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { ContentComponent } from './content/content.component';
import { HamburgerDirective } from './header/hamburger/hamburger.directive';
import { LinkDirective } from './sidebar/link.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    HomeComponent,
    ProjectComponent,
    RecentProjectComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectFormComponent,
    ProjectCreateComponent,
    ProjectDetailsComponent,
    ProjectEditComponent,
    NotificationComponent,
    TaskComponent,
    TaskListComponent,
    TaskListItemComponent,
    AssignUserComponent,
    CreditsComponent,
    RenameTaskTypePipe,
    TaskCreateComponent,
    TaskFormComponent,
    TaskEditComponent,
    TaskDetailComponent,
    HamburgerDirective,
    LinkDirective
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ContentComponent,
    HamburgerDirective,
    LinkDirective
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }]
})
export class DashboardModule {
}
