import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { CreateTask } from '../../../model/task/create-task.model';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { AlertService } from '../../../shared/alert/alert.service';
import { UpdateTask } from '../../../model/task/update-task.model';
import { GetTask } from '../../../model/task/get-task.model';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  error: string;
  @Input() isEdit: boolean;

  form!: FormGroup;
  task: Task | null;
  projectId: number | null;

  constructor(private taskService: TaskService, private alertService: AlertService, private authService: AuthService,
              private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.error = '';
    this.isEdit = false;
    this.task = null;
    this.projectId = null;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      startAt: new FormControl(null, [Validators.required]),
      endAt: new FormControl(null, [Validators.required])
    });

    if (this.isEdit) {
      this.getTaskDetails();
    }

    this.projectId = this.activatedRoute.snapshot.queryParams['projectId'];
  }

  onSubmit(): void {
    const name = this.form.get('name')?.value;
    const description = this.form.get('description')?.value;
    const type = this.form.get('type')?.value;
    const startAt = this.form.get('startAt')?.value;
    const endAt = this.form.get('endAt')?.value;

    if (!this.isEdit) {
      if (!this.projectId) {
        return;
      }

      this.taskService.createTask(new CreateTask(name, description, type, startAt, endAt, this.projectId)).subscribe(
        task => {
          this.alertService.alertSubject.next(new Alert(`Successfully created Task (${task.name})`, AlertType.SUCCESS));
          this.router.navigate(['/dashboard/project/details', task.project.id]).finally();
        }, error => {
          this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        }
      )
    } else {
      if (!this.task) {
        return;
      }

      // this.taskService.updateTask(new UpdateTask())
      return;
    }
  }

  private getTaskDetails(): void {
    this.activatedRoute.params.subscribe(
      param => {
        this.authService.user.pipe(take(1)).subscribe(
          user => {
            // Check if user is in a valid state
            if (!user) {
              return;
            }

            // Get task based on task identifier
            this.taskService.getTask(new GetTask(+param['id'], user.id)).subscribe(
              task => {
                // Populate form controls
                this.task = task;
                this.form.get('name')?.setValue(this.task.name);
                this.form.get('description')?.setValue(this.task.description);
                this.form.get('type')?.setValue(this.task.type);
                this.form.get('startAt')?.setValue(this.task.startAt);
                this.form.get('endAt')?.setValue(this.task.endAt);

                this.alertService.alertSubject.next(new Alert('Successfully retrieved task details.', AlertType.SUCCESS));
              }, error => {
                this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
              }
            )
          }
        )
      }
    )
  }
}
