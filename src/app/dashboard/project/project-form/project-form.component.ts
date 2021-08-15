import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/user/user.model';
import { UserService } from '../../../shared/user/user.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  form!: FormGroup;
  error: string;

  project?: Project;

  @Input()
  isEdit: boolean;
  isLoading: boolean;

  constructor(private projectService: ProjectService, private authService: AuthService, private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, private router: Router) {
    this.error = '';
    this.isEdit = false;
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      startAt: new FormControl(null, [Validators.required]),
      endAt: new FormControl(null, [Validators.required])
    });

    this.activatedRoute.params.subscribe(param => {
      this.authService.user.subscribe(user => {
        if (param['id']) {
          this.projectService.getProject(+param['id'], user.id).subscribe(
            project => {
              this.project = project;
              this.form.get('name')?.setValue(this.project.name);
              this.form.get('description')?.setValue(this.project.description);
              this.form.get('startAt')?.setValue(this.project.startAt);
              this.form.get('endAt')?.setValue(this.project.endAt);
            },
            error => this.router.navigate(['/project']).finally(),
            () => this.isLoading = false
          );
        }
      });
    });

  }

  onSubmit(): void {
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;
    const startAt = this.form.get('startAt')?.value;
    const endAt = this.form.get('endAt')?.value;
    const user = new User(2, '', '', '', '');

    if (this.isEdit && this.project) {
      // Update details and call update project endpoint
      this.project.name = name;
      this.project.description = description;
      this.project.startAt = startAt;
      this.project.endAt = endAt;
      this.projectService.updateProject(this.project).subscribe(
        response => this.router.navigate(['/project/details', response.id]),
        error => {
          console.log(error);
          this.error = error.error.message;
        }
      );
    } else {
      // Call create project endpoint with entered details
      this.projectService.createProject(new Project(0, name, description, startAt, endAt, user, [])).subscribe(
        response => this.router.navigate(['/project']),
        error => {
          this.error = error.message;
        }
      );
    }
  }
}
