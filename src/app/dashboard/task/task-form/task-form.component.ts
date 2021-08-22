import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { CreateTask } from '../../../model/task/create-task.model';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { AlertService } from '../../../shared/alert/alert.service';
import { GetTask } from '../../../model/task/get-task.model';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { TaskValidator } from '../../validator/task.validator';
import { UpdateTask } from '../../../model/task/update-task.model';
import { FormUtility } from '../../../shared/utility/form.utility';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  task?: Task;
  projectId?: number;
  userId?: number;
  isLoading: boolean;

  subscriptions: Subscription[];

  @Input() isEdit: boolean;

  constructor(private taskService: TaskService, private alertService: AlertService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.isEdit = false;
    this.isLoading = true;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required, TaskValidator.validateMaxLength(50)]),
      description: new FormControl('', [Validators.required, Validators.max(255)]),
      type: new FormControl('', [Validators.required, TaskValidator.validateType]),
      startAt: new FormControl('', [Validators.required]),
      endAt: new FormControl('', [Validators.required])
    });

    const authSub: Subscription = this.authService.auth.pipe(take(1)).subscribe(
      auth => {
        // Check if user is in a valid state
        if (auth) {
          this.userId = auth.user.id;
          this.activatedRoute.params.subscribe(
            param => {
              if (this.isEdit) {
                this.getTaskDetails(+param['id'], auth.user.id);
              } else {
                this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
                this.isLoading = false;
              }
            }
          );
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

  // Events

  onSubmit(): void {
    // Starts loading
    this.isLoading = true;

    // Trim all control values
    FormUtility.trimValues(this.form.controls);

    // Retrieve form data
    const name = this.form.get('name')?.value.trim();
    const description = this.form.get('description')?.value.trim();
    const type = this.form.get('type')?.value.trim();
    const startAt = this.form.get('startAt')?.value.trim();
    const endAt = this.form.get('endAt')?.value.trim();

    // Call service
    if (this.isEdit) {
      if (this.task && this.userId) {
        this.callTaskServices(new UpdateTask(this.task.id, name, description, type, this.task.completed, startAt, endAt, this.userId));
      }
    } else {
      if (this.projectId) {
        this.callTaskServices(new CreateTask(name, description, type, startAt, endAt, this.projectId));
      }
    }
  }

  // Private methods

  private getTaskDetails(taskId: number, userId: number): void {
    // Get task based on task identifier
    this.taskService.getTask(new GetTask(taskId, userId)).subscribe(
      task => {
        // Populate form controls
        this.task = task;
        this.form.get('name')?.setValue(this.task.name);
        this.form.get('description')?.setValue(this.task.description);
        this.form.get('type')?.setValue(this.task.type);
        this.form.get('startAt')?.setValue(this.task.startAt);
        this.form.get('endAt')?.setValue(this.task.endAt);

        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert('Successfully retrieved task details.', AlertType.SUCCESS));
      }, error => {
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );
  }

  private callTaskServices(task: CreateTask | UpdateTask): void {
    let callingService: Observable<Task>;
    if (this.isEdit) {
      task = <UpdateTask>task;
      callingService = this.taskService.updateTask(task);
    } else {
      task = <CreateTask>task;
      callingService = this.taskService.createTask(task);
    }

    const taskSub: Subscription = callingService.subscribe(
      task => {
        this.alertService.alertSubject.next(new Alert(`Successfully ${ this.isEdit ? 'updated' : 'created' } Task (${ task.name }).`, AlertType.SUCCESS));
        this.router.navigate(['/dashboard/project/details', task.project.id]).finally();
      }, error => {
        this.isLoading = false;
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );

    this.subscriptions.push(taskSub);
  }
}
