import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { ProjectList } from '../project-list.model';
import { GetManagedProjects } from '../../../model/project/get-managed-projects.model';
import { GetAssignedProjects } from '../../../model/project/get-assigned-projects.model';
import { Observable, Subscription } from 'rxjs';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Filter } from '../../../shared/model/filter/filter.model';
import { InputPage } from '../../../shared/model/input-page.model';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal.model';
import { ModalAction } from '../../../shared/modal/modal-action.enum';
import { ModalType } from '../../../shared/modal/modal-type.enum';
import { Project } from '../project.model';
import { DeleteProject } from '../../../model/project/delete-project.model';
import { ProjectFilter } from '../../../shared/model/filter/project-filter.model';
import { TaskFilter } from '../../../shared/model/filter/task-filter.model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.css']
})
export class ProjectListItemComponent implements OnInit, OnDestroy {

  projectList: ProjectList | null;
  isLoading: boolean;
  userId!: number;

  subscriptions: Subscription[];

  @Input()
  isManaged: boolean;

  constructor(private authService: AuthService, private projectService: ProjectService, private modalService: ModalService,
              private alertService: AlertService) {
    this.projectList = null;
    this.isLoading = true;
    this.isManaged = true;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    const authSub: Subscription = this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      // Update user ID
      this.userId = user.id;

      // Get project lists and init subscriptions
      this.getProject(this.userId, 1, '');
      this.initDeleteConfirmationSubscription(this.userId);
    });

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  // Modal toggling and subscriptions

  onToggleDeleteModal(project: Project): void {
    this.modalService.expandSubject.next(new Modal(project, ModalType.PROJECT, ModalAction.DELETE, true));
  }

  initDeleteConfirmationSubscription(userId: number): void {
    // Only init for managed projects
    if (this.isManaged) {
      const confirmationSub: Subscription = this.modalService.projectConfirmationSubject.subscribe(
        projectId => {
          if (projectId) {
            // Delete project
            const deleteProjectSub: Subscription = this.projectService.deleteProject(new DeleteProject(projectId, userId)).subscribe(
              () => {
                this.getProject(userId, 1, '');
                this.alertService.alertSubject.next(new Alert('Successfully deleted the project.', AlertType.SUCCESS));
              }, error => {
                this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
              }
            );

            this.subscriptions.push(deleteProjectSub);
          }
        });

      this.subscriptions.push(confirmationSub);
    }
  }

  // Paging and filtering

  calculatePages(): number[] {
    // Populate project list pages
    if (this.projectList) {
      let pages = [];

      for (let i = 1; i <= this.projectList.pagination.totalPages; i++) {
        pages.push(i);
      }

      return pages;
    } else {
      return [];
    }
  }

  getPage(pageNo: number): void {
    this.alertService.alertSubject.next(
      new Alert(`Viewing page ${ pageNo } of ${ this.projectList?.pagination.totalPages } of ${ this.isManaged ? 'managed' : 'assigned' } projects.`, AlertType.INFO));
    this.getProject(this.userId, pageNo, '');
  }

  filterProjects(filter: ProjectFilter): void {
    this.getProject(this.userId, 1, filter.searchString);
  }

  // Private methods

  private getProject(userId: number, pageNo: number, searchString: string): void {
    // List settings
    const filter = new Filter(searchString);
    const inputPage = new InputPage(pageNo, 5);

    // Call service to retrieve project lists
    let callingService: Observable<ProjectList>;
    if (this.isManaged) {
      callingService = this.projectService.getAllManagedProjects(new GetManagedProjects(userId, filter, inputPage));
    } else {
      callingService = this.projectService.getAllAssignedProjects(new GetAssignedProjects(userId, filter, inputPage));
    }

    const projectSub: Subscription = callingService.subscribe(
      projectList => {
        this.projectList = projectList;
        this.isLoading = false;
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.isLoading = false;
      }
    );

    this.subscriptions.push(projectSub);
  }
}
