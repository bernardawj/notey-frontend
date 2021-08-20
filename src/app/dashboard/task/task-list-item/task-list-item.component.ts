import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { TaskType } from '../task-type.enum';
import { TaskList } from '../task-list.model';
import { ActivatedRoute } from '@angular/router';
import { GetProjectTasks } from '../../../model/task/get-project-tasks.model';
import { GetUserTasks } from '../../../model/task/get-user-tasks.model';
import { Task } from '../task.model';
import { AssignTask } from '../../../model/task/assign-task.model';
import { ModalService } from '../../../shared/modal/modal.service';
import { Modal } from '../../../shared/modal/modal.model';
import { ModalType } from '../../../shared/modal/modal-type.enum';
import { ModalAction } from '../../../shared/modal/modal-action.enum';
import { Alert } from '../../../shared/alert/alert.model';
import { AlertType } from '../../../shared/alert/alert-type.enum';
import { AlertService } from '../../../shared/alert/alert.service';
import { InputPage } from '../../../shared/model/input-page.model';
import { Subscription } from 'rxjs';
import { TaskFilter } from '../../../shared/model/filter/task-filter.model';
import { ProjectFilter } from '../../../shared/model/filter/project-filter.model';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css']
})
export class TaskListItemComponent implements OnInit, OnDestroy {

  userId?: number;
  isLoading: boolean;
  taskList: TaskList | null;
  subscriptions: Subscription[];
  filter: TaskFilter;

  @Input() loadProjectTasks: boolean;
  @Input() hasAccepted: boolean;
  @Input() isManaged: boolean;
  @Input() projectId: number | undefined;

  constructor(private authService: AuthService, private taskService: TaskService, private modalService: ModalService,
              private alertService: AlertService, private activatedRoute: ActivatedRoute) {
    this.loadProjectTasks = false;
    this.isManaged = false;
    this.isLoading = true;
    this.taskList = null;
    this.hasAccepted = false;
    this.subscriptions = [];
    this.filter = new TaskFilter('', null, null);
  }

  // Angular lifecycles

  ngOnInit(): void {
    const authSub: Subscription = this.authService.user.pipe(take(1)).subscribe(
      user => {
        if (user) {
          this.userId = user.id;

          if (this.loadProjectTasks) {
            this.getProjectTasks(1, this.filter);
            this.loadTaskCompletionSubscription();
            this.loadAssignTaskSubscription(this.userId);
            this.loadDeleteTaskSubscription(this.userId);
            this.loadReloadTaskListSubscription();
          } else {
            this.getUserTasks(this.userId, 1);
          }
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

  onToggleCompletionModal(task: Task, complete: boolean): void {
    if (complete) {
      this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.COMPLETE, true));
    } else {
      this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.INCOMPLETE, true));
    }
  }

  onToggleAssignTaskModal(task: Task, assign: boolean): void {
    if (assign) {
      this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.ASSIGN, true));
    } else {
      this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.REMOVE, true));
    }
  }

  onToggleDeleteTaskModal(task: Task): void {
    this.modalService.expandSubject.next(new Modal(task, ModalType.TASK, ModalAction.DELETE, true));
  }

  // Subscriptions

  loadTaskCompletionSubscription(): void {
    const confirmSub: Subscription = this.modalService.taskCompletionSubject.subscribe(
      taskCompletion => {
        if (taskCompletion) {
          const completionSub: Subscription = this.taskService.markTaskAsCompleted(taskCompletion).subscribe(
            () => {
              this.getProjectTasks(1, this.filter);
              this.alertService.alertSubject.next(new Alert(`Successfully marked task as ${ taskCompletion.complete ? 'completed' : 'incomplete' }.`, AlertType.SUCCESS));
            }, error => {
              this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
            }
          );

          this.subscriptions.push(completionSub);
        }
      }
    );

    this.subscriptions.push(confirmSub);
  }

  loadAssignTaskSubscription(userId: number): void {
    const taskAssignmentSub: Subscription = this.modalService.taskAssignmentSubject.subscribe(
      assignTask => {
        assignTask.managerId = userId;
        this.taskAssignment(assignTask);
      }
    );

    this.subscriptions.push(taskAssignmentSub);
  }

  loadDeleteTaskSubscription(userId: number): void {
    const confirmationSub: Subscription = this.modalService.taskConfirmationSubject.subscribe(
      taskId => {
        this.taskService.deleteTask(taskId, userId).subscribe(
          () => {
            if (this.taskList && this.taskList.pagination) {
              this.alertService.alertSubject.next(new Alert(`Successfully deleted task.`, AlertType.SUCCESS));
              this.getProjectTasks(this.taskList.pagination.currentPage, this.filter);
            }
          }, error => {
            this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
          }
        );
      }
    );

    this.subscriptions.push(confirmationSub);
  }

  loadReloadTaskListSubscription(): void {
    const reloadSub: Subscription = this.taskService.reloadTask.subscribe(
      response => {
        if (response) {
          this.getProjectTasks(1, this.filter);
        }
      }
    );

    this.subscriptions.push(reloadSub);
  }

  // Class setter methods

  determineTaskTypeTag(type: TaskType): string {
    if (type == TaskType.URGENT) {
      return 'label-tag label-tag--danger';
    } else if (type == TaskType.NON_URGENT) {
      return 'label-tag label-tag--info';
    } else {
      return '';
    }
  }

  determineCompletionTag(complete: boolean): string {
    if (complete) {
      return 'label-tag label-tag--success';
    } else {
      return 'label-tag label-tag--danger';
    }
  }

  isUser(userId: number): boolean {
    return userId === this.userId && this.hasAccepted;
  }

  // Filtering and paging

  calculatePages(): number[] {
    if (this.taskList) {
      let pages = [];

      for (let i = 1; i <= this.taskList.pagination.totalPages; i++) {
        pages.push(i);
      }

      return pages;
    } else {
      return [];
    }
  }

  getPage(pageNo: number): void {
    if (this.userId) {
      this.alertService.alertSubject.next(
        new Alert(`Viewing page ${ pageNo } of ${ this.taskList?.pagination.totalPages } of ${ this.loadProjectTasks ? 'project\'s' : 'assigned' } tasks.`, AlertType.INFO));
      if (this.loadProjectTasks) {
        this.getProjectTasks(pageNo, this.filter);
      } else {
        this.getUserTasks(this.userId, pageNo);
      }
    }
  }

  filterTasks(filter: TaskFilter | ProjectFilter): void {
    if (this.loadProjectTasks) {
      this.filter = <TaskFilter>filter;
      console.log(this.filter);
      this.getProjectTasks(1, this.filter);
    }
  }

  // Private methods

  private getProjectTasks(pageNo: number, filter: TaskFilter): void {
    const projectId = this.activatedRoute.snapshot.params['id'];
    const inputPage = new InputPage(pageNo, 5);

    const getProjectTasksSub: Subscription = this.taskService.getAllProjectTasks(new GetProjectTasks(projectId, filter, inputPage)).subscribe(
      taskList => {
        this.taskList = taskList;
        this.isLoading = false;
      }
    );

    this.subscriptions.push(getProjectTasksSub);
  }

  private getUserTasks(userId: number, pageNo: number): void {
    const getUserTasksSub: Subscription = this.taskService.getAllUserTasks(new GetUserTasks(userId, pageNo, 5)).subscribe(
      taskList => {
        this.taskList = taskList;
        this.isLoading = false;
      },
      error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        this.isLoading = false;
      }
    );

    this.subscriptions.push(getUserTasksSub);
  }

  private taskAssignment(assignTask: AssignTask): void {
    const updateAssignmentSub: Subscription = this.taskService.updateTaskAssignment(assignTask).subscribe(
      () => {
        if (this.taskList && this.taskList.pagination) {
          // Prompt specific alert message
          if (assignTask.assign) {
            this.alertService.alertSubject.next(new Alert(`Successfully assigned task to user.`, AlertType.SUCCESS));
          } else {
            this.alertService.alertSubject.next(new Alert(`Successfully removed task assignment from user.`, AlertType.SUCCESS));
          }

          // Reload project tasks
          this.getProjectTasks(this.taskList.pagination.totalPages, this.filter);
        }
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );

    this.subscriptions.push(updateAssignmentSub);
  }
}
