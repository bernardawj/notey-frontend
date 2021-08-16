import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../../shared/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { AssignProject } from '../../../model/project/assign-project.model';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  assignForm!: FormGroup;
  success: string;
  error: string;

  @Input() project: Project | null;
  @Input() manageUser: boolean;

  @Output() assignEvent: EventEmitter<boolean>;

  constructor(private userService: UserService, private projectService: ProjectService, private formBuilder: FormBuilder) {
    this.success = this.error = '';
    this.project = null;
    this.manageUser = false;
    this.assignEvent = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.assignForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onAssign(): void {
    this.error = this.success = '';

    if (!this.project) {
      return;
    }

    const email = this.assignForm.get('email')?.value;

    this.projectService.assignProject(new AssignProject(this.project.id, email)).subscribe(
      () => {
        this.success = `Successfully invited ${ email }.`;
        this.assignEvent.emit(true);
      }, error => {
        this.error = error.error.message;
    });
  }
}
