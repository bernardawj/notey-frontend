import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  project: Project | null;
  isManager: boolean;

  constructor(private projectService: ProjectService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.project = null;
    this.isManager = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      param => {
        this.projectService.getProject(+param["id"]).subscribe(
          project => {
            this.project = project;
            this.isManager = this.project.manager.id == 1;
          }, error => {
            this.router.navigate(['/project']).finally();
          }
        );
      }
    )
  }
}
