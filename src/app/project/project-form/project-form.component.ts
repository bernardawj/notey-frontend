import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { Router } from '@angular/router';
import { User } from '../../shared/user.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {

  form!: FormGroup;
  error: string;

  @Input()
  isEdit: boolean;

  constructor(private projectService: ProjectService, private formBuilder: FormBuilder, private router: Router) {
    this.error = '';
    this.isEdit = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null),
      description: new FormControl(null),
      startAt: new FormControl(null),
      endAt: new FormControl(null)
    });
  }

  onSubmit(): void {
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;
    const startAt = this.form.get('startAt')?.value;
    const endAt = this.form.get('endAt')?.value;
    const user = new User(1, '', '', '');

    if (this.isEdit) {
      // this.projectService.updateProject();
    } else {
      this.projectService.createProject(new Project(0, name, description,startAt, endAt, user, [])).subscribe(
        response => {
          this.router.navigate(['/project']).finally();
        }, error => {
          this.error = error.message;
        }
      );
    }
  }
}
