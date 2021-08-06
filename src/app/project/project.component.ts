import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from './project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

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
