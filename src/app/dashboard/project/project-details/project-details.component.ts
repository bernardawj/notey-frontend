import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../../shared/user/user.service';
import { ProjectAcceptance } from '../../../shared/model/project-acceptance.model';
import { AuthService } from '../../../auth/auth.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal.model';
import { ModalType } from '../../../shared/modal/modal-type.enum';
import { ModalAction } from '../../../shared/modal/modal-action.enum';
import { AssignedUser } from '../../../shared/model/assigned-user.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Subscription } from 'rxjs';
import { TaskService } from '../../task/task.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  project?: Project;
  isManager: boolean;
  isLoading: boolean;
  hasAccepted: boolean;
  manageUserMode: boolean;
  projectId!: number;
  userId!: number;

  subscriptions: Subscription[];

  constructor(private projectService: ProjectService, private userService: UserService, private authService: AuthService,
              private taskService: TaskService, private modalService: ModalService, private alertService: AlertService,
              private router: Router, private activatedRoute: ActivatedRoute) {
    this.isManager = false;
    this.isLoading = true;
    this.hasAccepted = true;
    this.manageUserMode = false;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    const authSub: Subscription = this.authService.user.subscribe(user => {
      if (user) {
        // Set user ID for easier retrieval
        this.userId = user.id;

        this.activatedRoute.params.subscribe(
          param => {
            this.projectId = param['id'];
            if (this.projectId) {
              this.getProject(this.projectId, this.userId, true);
            }
          });
      }
    });

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  // Updating acceptance of project

  onUpdateAcceptance(accept: boolean): void {
    if (this.userId && this.project) {
      const acceptanceSub: Subscription = this.projectService.updateProjectAcceptance(new ProjectAcceptance(this.project.id, this.userId, accept)).subscribe(
        () => {
          if (this.project) {
            this.alertService.alertSubject.next(new Alert(`Successfully ${ accept ? 'accepted' : 'rejected' } the project invitation.`, AlertType.SUCCESS));
            this.getProject(this.project.id, this.userId, false);
          }
        }
      );

      this.subscriptions.push(acceptanceSub);
    }
  }

  // Assigning user

  onAssignUser(assigned: boolean): void {
    if (assigned) {
      if (this.project && this.userId) {
        this.getProject(this.project.id, this.userId, false);
        this.taskService.reloadTask.next(true);
      }
    }
  }

  // Modal toggling events and subscriptions

  onToggleRemoveUserAssignmentModal(user: AssignedUser): void {
    this.modalService.expandSubject.next(new Modal(user, ModalType.ASSIGNED_USER, ModalAction.REMOVE, true));
  }

  loadRemoveProjectAssignmentSubscription(projectId: number, managerId: number): void {
    const removeAssignmentSub: Subscription = this.modalService.removeProjectAssignmentSubject.subscribe(
      removeProjectAssignment => {
        if (removeProjectAssignment) {
          // Update remove project values
          removeProjectAssignment.projectId = projectId;
          removeProjectAssignment.managerId = managerId;

          // Call endpoint for removing user from project
          const removeUserSub: Subscription = this.projectService.removeUserFromProject(removeProjectAssignment).subscribe(
            () => {
              // Re-init the project details
              this.getProject(projectId, managerId, false);
              this.taskService.reloadTask.next(true);
              this.alertService.alertSubject.next(new Alert('Successfully removed user from project.', AlertType.SUCCESS));
            }, error => {
              this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
            }
          );

          this.subscriptions.push(removeUserSub);
        }
      }
    );

    this.subscriptions.push(removeAssignmentSub);
  }

  onManageClick(): void {
    this.manageUserMode = !this.manageUserMode;
  }

  // Private methods

  private getProject(projectId: number, userId: number, firstLoad: boolean): void {
    const projectSub: Subscription = this.projectService.getProject(projectId, userId).subscribe(
      project => {
        this.isLoading = false;
        this.project = project;
        this.isManager = this.hasAccepted = this.project.manager.id == userId;

        const assignedUser = this.project.assignedUsers.find(u => u.userId === userId);
        if (assignedUser) {
          this.hasAccepted = assignedUser.hasAccepted;
        }

        // Init subscription for removing user assignment
        if (firstLoad) {
          this.loadRemoveProjectAssignmentSubscription(this.project.id, this.project.manager.id);
        }
      }, error => {
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.router.navigate(['/dashboard/project']).finally();
      }
    );

    this.subscriptions.push(projectSub);
  }
}
