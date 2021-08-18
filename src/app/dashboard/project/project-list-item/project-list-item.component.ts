import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { ProjectList } from '../project-list.model';
import { GetManagedProjects } from '../../../model/project/get-managed-projects.model';
import { GetAssignedProjects } from '../../../model/project/get-assigned-projects.model';
import { Observable } from 'rxjs';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Filter } from '../../../shared/model/filter.model';
import { InputPage } from '../../../shared/model/input-page.model';

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

  constructor(private authService: AuthService, private projectService: ProjectService, private alertService: AlertService) {
    this.projectList = this.projectListCopy = null;
    this.error = '';
    this.isLoading = true;
    this.isManaged = true;
  }

  ngOnInit(): void {
    // Initialize project list
    this.getProject(1, '');
  }

  calculatePages(): number[] {
    // Check if project list is empty
    if (!this.projectList) {
      return [];
    }

    // Populate project list pages
    let pages = [];
    for (let i = 1; i <= this.projectList.pagination.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onToggleDeleteModal(): void {

  }

  getPage(pageNo: number): void {
    this.alertService.alertSubject.next(
      new Alert(`Viewing page ${ pageNo } of ${ this.projectList?.pagination.totalPages } of ${ this.isManaged ? 'managed' : 'assigned' } projects.`, AlertType.INFO));
    this.getProject(pageNo, '');
  }

  filterProjects(searchString: string): void {
    // this.projectListCopy!.projects = filteredProjects;
    this.getProject(1, searchString);
  }

  private getProject(pageNo: number, searchString: string): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      // List settings
      const filter = new Filter(searchString);
      const inputPage = new InputPage(pageNo, 5);

      let callingService: Observable<ProjectList>;
      if (this.isManaged) {
        callingService = this.projectService.getAllManagedProjects(new GetManagedProjects(user.id, filter, inputPage));
      } else {
        callingService = this.projectService.getAllAssignedProjects(new GetAssignedProjects(user.id, filter, inputPage));
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
