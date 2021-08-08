import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';

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

  constructor(private projectService: ProjectService) {
    this.projects = [];
    this.error = "";
    this.isLoading = true;
    this.isManaged = true;
  }

  ngOnInit(): void {
    if (this.isManaged) {
      this.projectService.getAllManagedProjects(1).subscribe(
        response => {
          this.projects = response;
          this.isLoading = false;
        }, error => {
          this.error = error;
          this.isLoading = false;
        }
      );
    } else {
      this.projectService.getAllAssignedProjects(1).subscribe(
        response => {
          this.projects = response;
          this.isLoading = false;
        }, error => {
          this.error = error;
          this.isLoading = false;
        }
      );
    }
  }
}
