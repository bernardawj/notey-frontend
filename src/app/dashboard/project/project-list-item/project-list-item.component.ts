import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { ProjectList } from '../project-list.model';
import { GetManagedProjects } from '../../../model/project/get-managed-projects.model';
import { GetAssignedProjects } from '../../../model/project/get-assigned-projects.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.css']
})
export class ProjectListItemComponent implements OnInit {

  projectList: ProjectList | null;
  projectListCopy: ProjectList | null;
  error: string;

  isLoading: boolean;

  @Input()
  isManaged: boolean;

  constructor(private authService: AuthService, private projectService: ProjectService) {
    this.projectList = this.projectListCopy = null;
    this.error = '';
    this.isLoading = true;
    this.isManaged = true;
  }

  ngOnInit(): void {
    this.getProject(1);
  }

  calculatePages(): number[] {
    if (!this.projectList) {
      return [];
    }

    let pages = [];
    for (let i = 1; i <= this.projectList.pagination.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPage(pageNo: number): void {
    this.getProject(pageNo);
  }

  filterProjects(filteredProjects: Project[]): void {
    this.projectListCopy!.projects = filteredProjects;
  }

  private getProject(pageNo: number): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      let callingService: Observable<ProjectList>;
      if (this.isManaged) {
        callingService = this.projectService.getAllManagedProjects(new GetManagedProjects(user.id, pageNo, 10));
      } else {
        callingService = this.projectService.getAllAssignedProjects(new GetAssignedProjects(user.id, pageNo, 10));
      }

      callingService.subscribe(
        projectList => {
          this.projectList = projectList;
          this.projectListCopy = Object.assign(new ProjectList(this.projectList.projects, this.projectList.pagination), this.projectList);
          this.isLoading = false;
        }, error => {
          this.error = error;
          this.isLoading = false;
        }
      );
    });
  }
}
