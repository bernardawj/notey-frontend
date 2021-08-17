import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { ProjectList } from '../project-list.model';
import { GetManagedProjects } from '../../../model/project/get-managed-projects.model';
import { GetAssignedProjects } from '../../../model/project/get-assigned-projects.model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.css']
})
export class ProjectListItemComponent implements OnInit {

  projectList: ProjectList | null;
  error: string;

  isLoading: boolean;

  @Input()
  isManaged: boolean;

  constructor(private authService: AuthService, private projectService: ProjectService) {
    this.projectList = null;
    this.error = "";
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

  private getProject(pageNo: number): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      if (this.isManaged) {
        this.getManagedProjects(user.id, pageNo);
      } else {
        this.getAssignedProjects(user.id, pageNo);
      }
    });
  }

  private getManagedProjects(userId: number, pageNo: number): void {
    this.projectService.getAllManagedProjects(new GetManagedProjects(userId, pageNo, 10)).subscribe(
      projectList => {
        this.projectList = projectList;
        this.isLoading = false;
      }, error => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }

  private getAssignedProjects(userId: number, pageNo: number): void {
    this.projectService.getAllAssignedProjects(new GetAssignedProjects(userId, pageNo, 10)).subscribe(
      projectList => {
        this.projectList = projectList;
        this.isLoading = false;
      }, error => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }
}
