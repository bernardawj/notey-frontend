import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: Project[];
  error: string;

  constructor(private projectService: ProjectService) {
    this.projects = [];
    this.error = "";
  }

  ngOnInit(): void {
    this.projectService.getAllManagedProjects(2).subscribe(
      response => {
        this.projects = response;
        console.log(this.projects);
      }, error => {
        this.error = error;
        console.log(this.error);
      }
    );
  }
}
