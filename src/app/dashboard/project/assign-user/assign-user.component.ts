import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserService } from '../../../shared/user/user.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';
import { AssignProject } from '../../../model/project/assign-project.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit, OnDestroy {

  assignForm!: UntypedFormGroup;
  userId?: number;

  subscriptions: Subscription[];

  @Input() project: Project | undefined;
  @Input() manageUser: boolean;

  @Output() assignEvent: EventEmitter<boolean>;

  constructor(private userService: UserService, private projectService: ProjectService, private alertService: AlertService,
              private authService: AuthService, private formBuilder: UntypedFormBuilder) {
    this.manageUser = false;
    this.assignEvent = new EventEmitter<boolean>();
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    this.assignForm = this.formBuilder.group({
      email: new UntypedFormControl('', [Validators.required, Validators.email])
    });

    const authSub: Subscription = this.authService.auth.subscribe(
      auth => {
        if (auth) {
          this.userId = auth.user.id;
        }
      }
    );

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  // Assign user to project

  onAssign(): void {
    if (this.project && this.userId) {
      const email = this.assignForm.get('email')?.value;

      const assignSub: Subscription = this.projectService.assignProject(new AssignProject(this.project.id, this.userId, email)).subscribe(
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
