import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.css']
})
export class ProjectListItemComponent implements OnInit {

  projects: Project[];
  error: string;

  isLoading: boolean;

  @Input()
  isManaged: boolean;

  constructor(private authService: AuthService, private projectService: ProjectService) {
    this.projects = [];
    this.error = "";
    this.isLoading = true;
    this.isManaged = true;
  }

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      if (this.isManaged) {
        this.projectService.getAllManagedProjects(user.id).subscribe(
          response => {
            this.projects = response;
          }, error => {
            this.error = error;
          }, () => this.isLoading = false
        );
      } else {
        this.projectService.getAllAssignedProjects(user.id).subscribe(
          response => {
            this.projects = response;
          }, error => {
            this.error = error;
          }, () => this.isLoading = false
        );
      }
    });
  }
}
