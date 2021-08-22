import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { AuthService } from '../../../auth/auth.service';
import { Subscription } from 'rxjs';
import { GetTask } from '../../../model/task/get-task.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { User } from '../../../shared/user/user.model';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal.model';
import { ModalAction } from '../../../shared/modal/modal-action.enum';
import { ModalType } from '../../../shared/modal/modal-type.enum';
import { AssignTask } from '../../../model/task/assign-task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit, OnDestroy {

  task?: Task;
  isLoading: boolean;
  isManager: boolean;
  taskId?: number;
  userId?: number;

  subscriptions: Subscription[];

  constructor(private taskService: TaskService, private authService: AuthService, private alertService: AlertService,
              private modalService: ModalService, private activatedRoute: ActivatedRoute) {
    this.isLoading = true;
    this.isManager = false;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    const authSub: Subscription = this.authService.auth.subscribe(
      auth => {
        if (auth) {
          this.userId = auth.user.id;
          this.loadTaskDetails(this.userId);
          this.loadAssignTaskSubscription(this.userId);
        }
      }
    );

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  // Toggle

  onToggleRemoveUserFromTaskModal(task: Task): void {
    this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.REMOVE, true));
  }

  onToggleAssignUserToTaskModal(task: Task): void {
    this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.ASSIGN, true));
  }

  // Modal events and subscriptions

  loadAssignTaskSubscription(userId: number): void {
    const taskAssignmentSub: Subscription = this.modalService.taskAssignmentSubject.subscribe(
      assignTask => {
        assignTask.managerId = userId;
        this.taskAssignment(assignTask);
      }
    );

    this.subscriptions.push(taskAssignmentSub);
  }

  // Private methods

  private loadTaskDetails(userId: number) {
    this.isLoading = true;

    const paramSub: Subscription = this.activatedRoute.params.subscribe(
      param => {
        if (param['id']) {
          this.taskId = +param['id'];

          const taskSub: Subscription = this.taskService.getTask(new GetTask(this.taskId, userId)).subscribe(
            task => {
              // Check if user is the manager of this task's project
              if (task.project?.manager?.id === userId) {
                this.isManager = true;
              }

              this.task = task;
              this.isLoading = false;
            }, error => {
              this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
              this.isLoading = false;
            }
          );

          this.subscriptions.push(taskSub);
        }
      }
    );

    this.subscriptions.push(paramSub);
  }

  private taskAssignment(assignTask: AssignTask): void {
    const updateAssignmentSub: Subscription = this.taskService.updateTaskAssignment(assignTask).subscribe(
      () => {
        // Prompt specific alert message
        if (assignTask.assign) {
          this.alertService.alertSubject.next(new Alert(`Successfully assigned task to user.`, AlertType.SUCCESS));
        } else {
          this.alertService.alertSubject.next(new Alert(`Successfully removed task assignment from user.`, AlertType.SUCCESS));
        }

        // Reload project tasks
        if (this.userId) {
          this.loadTaskDetails(this.userId);
        }
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );

    this.subscriptions.push(updateAssignmentSub);
  }
}
