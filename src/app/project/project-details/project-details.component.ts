import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { UserService } from '../../shared/user/user.service';
import { ProjectAcceptance } from '../../shared/model/project-acceptance.model';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project | null;
  isManager: boolean;
  isLoading: boolean;
  hasAccepted: boolean;

  constructor(private projectService: ProjectService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.project = null;
    this.isManager = false;
    this.isLoading = true;
    this.hasAccepted = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      param => {
        this.projectService.getProject(+param['id']).subscribe(
          project => {
            this.project = project;
            this.isManager = this.project.manager.id == 2;

            const assignedUser = this.project.assignedUsers.find(s => s.userId === 2);
            if (assignedUser) {
              this.hasAccepted = assignedUser.hasAccepted;
            }
          }, error => {
            // this.router.navigate(['/project']).finally();
          }, () => {
            this.isLoading = false;
          }
        );
      }
    )
  }

  onUpdateAcceptance(accept: boolean): void {
    if (this.project) {
      this.userService.updateProjectAcceptance(new ProjectAcceptance(this.project.id, 2, accept)).subscribe(
        response => this.router.navigate(['.'])
      );
    }
  }
}
