import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { RecentProjectComponent } from './project/recent-project/recent-project.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectListItemComponent } from './project/project-list-item/project-list-item.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';

import { NameInitialsPipe } from './shared/name-initials.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProjectComponent,
    RecentProjectComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectFormComponent,
    ProjectCreateComponent,
    ProjectDetailsComponent,
    NameInitialsPipe
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
