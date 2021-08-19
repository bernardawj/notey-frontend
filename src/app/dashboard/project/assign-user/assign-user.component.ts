import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserService } from '../../../shared/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { AssignProject } from '../../../model/project/assign-project.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit, OnDestroy {

  assignForm!: FormGroup;

  subscriptions: Subscription[];

  @Input() project: Project | undefined;
  @Input() manageUser: boolean;

  @Output() assignEvent: EventEmitter<boolean>;

  constructor(private userService: UserService, private projectService: ProjectService, private alertService: AlertService,
              private formBuilder: FormBuilder) {
    this.manageUser = false;
    this.assignEvent = new EventEmitter<boolean>();
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    this.assignForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  // Assign user to project

  onAssign(): void {
    if (this.project) {
      const email = this.assignForm.get('email')?.value;

      const assignSub: Subscription = this.projectService.assignProject(new AssignProject(this.project.id, email)).subscribe(
        () => {
          this.alertService.alertSubject.next(new Alert(`Successfully invited ${ email }.`, AlertType.SUCCESS));
          this.resetForm();
          this.assignEvent.emit(true);
        }, error => {
          this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        });

      this.subscriptions.push(assignSub);
    }
  }

  // Private methods

  private resetForm(): void {
    this.assignForm.reset({
      email: null
    });
  }
}
