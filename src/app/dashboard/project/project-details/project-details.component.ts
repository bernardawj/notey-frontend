import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../../shared/user/user.service';
import { ProjectAcceptance } from '../../../shared/model/project-acceptance.model';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal.model';
import { ModalType } from '../../../shared/modal/modal-type.enum';
import { ModalAction } from '../../../shared/modal/modal-action.enum';
import { AssignedUser } from '../../../shared/model/assigned-user.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project | undefined;
  isManager: boolean;
  isLoading: boolean;
  hasAccepted: boolean;
  manageUserMode: boolean;
  userId: number | null;

  constructor(private projectService: ProjectService, private userService: UserService, private authService: AuthService,
              private modalService: ModalService, private alertService: AlertService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.isManager = false;
    this.isLoading = true;
    this.hasAccepted = true;
    this.manageUserMode = false;
    this.userId = null;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      param => {
        this.authService.user.subscribe(user => {
          if (!user) {
            return;
          }

          this.userId = user.id;
          this.getProject(+param['id'], this.userId, true);
        });
      }
    )
  }

  onUpdateAcceptance(accept: boolean): void {
    this.authService.user.pipe(take(1)).subscribe(
      user => {
        if (!user || !this.project) {
          return;
        }

        this.projectService.updateProjectAcceptance(new ProjectAcceptance(this.project.id, user.id, accept)).subscribe(
          () => {
            if (!this.project) {
              return;
            }

            this.alertService.alertSubject.next(new Alert(`Successfully ${ accept ? 'accepted' : 'rejected' } the project invitation.`, AlertType.SUCCESS));
            this.getProject(this.project.id, user.id, false);
          }
        );
      }
    );
  }

  onManageClick(): void {
    this.manageUserMode = !this.manageUserMode;
  }

  onAssignUser(assigned: boolean): void {
    if (assigned) {
      if (!this.project || !this.userId) {
        return;
      }

      this.getProject(this.project.id, this.userId, false);
    }
  }

  onRemoveUserAssignment(user: AssignedUser): void {
    this.modalService.expandEmitter.emit(new Modal(user, ModalType.ASSIGNED_USER, ModalAction.REMOVE, true));
  }

  onRemoveUserAssignmentConfirmed(projectId: number, managerId: number): void {
    this.modalService.removeProjectAssignmentSubject.subscribe(
      removeProjectAssignment => {
        if (!removeProjectAssignment) {
          return;
        }

        // Update remove project values
        removeProjectAssignment.projectId = projectId;
        removeProjectAssignment.managerId = managerId;

        // Call endpoint for removing user from project
        this.projectService.removeUserFromProject(removeProjectAssignment).subscribe(
          () => {
            // Re-init the project details
            this.getProject(projectId, managerId, false);
            this.alertService.alertSubject.next(new Alert('Successfully removed user from project.', AlertType.SUCCESS));
          }, error => {
            this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
          }
        )
      }
    )
  }

  private getProject(projectId: number, userId: number, firstLoad: boolean): void {
    this.projectService.getProject(projectId, userId).subscribe(
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
          this.onRemoveUserAssignmentConfirmed(this.project.id, this.project.manager.id);
        }
      }, error => {
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.router.navigate(['/dashboard/project']).finally();
      }
    );
  }
}
