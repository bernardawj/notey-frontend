import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../../shared/user/user.service';
import { ProjectAcceptance } from '../../../shared/model/project-acceptance.model';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';

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
              private router: Router, private activatedRoute: ActivatedRoute) {
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
          this.getProject(+param['id'], this.userId);
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

            this.getProject(this.project.id, user.id);
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

      this.getProject(this.project.id, this.userId);
    }
  }

  private getProject(projectId: number, userId: number): void {
    this.projectService.getProject(projectId, userId).subscribe(
      project => {
        this.project = project;
        this.isManager = this.hasAccepted = this.project.manager.id == userId;

        const assignedUser = this.project.assignedUsers.find(u => u.userId === userId);
        if (assignedUser) {
          this.hasAccepted = assignedUser.hasAccepted;
        }
      }, () => {
        this.router.navigate(['/dashboard/project']).finally();
      }, () => {
        this.isLoading = false;
      }
    );
  }
}
