import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css']
})
export class TaskListItemComponent implements OnInit {

  isLoading: boolean;
  error: string;

  @Input() loadProjectTasks: boolean;

  @Input() hasAccepted: boolean;

  @Input() isManaged: boolean;

  @Input() projectId: number | undefined;

  taskList: TaskList | null;
  taskListCopy: TaskList | null;

  currentUserId: number | null;

  constructor(private authService: AuthService, private taskService: TaskService, private modalService: ModalService, private activatedRoute: ActivatedRoute) {
    this.loadProjectTasks = false;
    this.isManaged = false;
    this.isLoading = true;
    this.error = '';
    this.taskList = this.taskListCopy = null;
    this.currentUserId = null;
    this.hasAccepted = false;
  }

  ngOnInit(): void {
    if (this.loadProjectTasks) {
      this.getProjectTasks(1);
      this.deleteTaskListener();
      this.assignTaskListener();
      this.getCurrentUserId();
    } else {
      this.getUserTasks(1);
    }
  }

  isUser(userId: number): boolean {
    return userId === this.currentUserId && this.hasAccepted;
  }

  assignTaskModal(task: Task): void {
    this.modalService.expandEmitter.emit(new Modal(task, ModalType.TASK, ModalAction.ASSIGN, true));
  }

  assignTaskListener(): void {
    this.modalService.taskAssignmentEmitter.subscribe(
      assignTask => {
        this.authService.user.pipe(take(1)).subscribe(
          user => {
            if (!user) {
              return;
            }

            assignTask.managerId = user.id;
            this.taskService.updateTaskAssignment(assignTask).subscribe(
              () => {
                if (!this.taskList || !this.taskList.pagination) {
                  return;
                }

                // Get current page
                this.getProjectTasks(this.taskList.pagination.totalPages);
              }, error => {
                this.error = error.error.message;
              }
            );
          }
        )
      }
    );
  }

  removeTaskAssignment(taskId: number, taskUserId: number): void {
    if (!this.isManaged) {
      return;
    }

    this.authService.user.pipe(take(1)).subscribe(
      user => {
        if (!user) {
          return;
        }

        this.taskService.updateTaskAssignment(new AssignTask(taskId, taskUserId, user.id, false)).subscribe(
          () => {
            if (!this.taskList || !this.taskList.pagination) {
              return;
            }

            this.getProjectTasks(this.taskList.pagination.totalPages);
          }, error => {
            this.error = error.error.message;
          }
        )
      }
    );
  }

  deleteTaskModal(task: Task): void {
    this.modalService.expandEmitter.emit(new Modal(task, ModalType.TASK, ModalAction.DELETE, true));
  }

  deleteTaskListener(): void {
    this.modalService.taskConfirmationEmitter.subscribe(
      taskId => {
        this.authService.user.pipe(take(1)).subscribe(
          user => {
            if (!user) {
              return;
            }

            this.taskService.deleteTask(taskId, user.id).subscribe(
              () => {
                // TODO: prompt alert message
                if (!this.taskList || !this.taskList.pagination) {
                  return;
                }
                this.getProjectTasks(this.taskList.pagination.currentPage);
              }, error => {
                this.error = error.error.message;
              }
            )
          }
        );
      }
    )
  }

  determineTaskTypeTag(type: TaskType): string {
    if (type == TaskType.URGENT) {
      return 'label-tag label-tag--danger';
    } else if (type == TaskType.NON_URGENT) {
      return 'label-tag label-tag--info';
    } else {
      return '';
    }
  }

  calculatePages(): number[] {
    if (!this.taskList) {
      return [];
    }

    let pages = [];
    for (let i = 1; i <= this.taskList.pagination.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPage(pageNo: number): void {
    this.isLoading = true;
    if (this.loadProjectTasks) {
      this.getProjectTasks(pageNo);
    } else {
      this.getUserTasks(pageNo);
    }
  }

  filterTasks(filteredTasks: Task[]): void {
    console.log(filteredTasks)
    this.taskListCopy!.tasks = filteredTasks;
  }

  private getProjectTasks(pageNo: number): void {
    const projectId = this.activatedRoute.snapshot.params['id'];
    this.taskService.getAllProjectTasks(new GetProjectTasks(projectId, pageNo, 5)).subscribe(
      taskList => {
        this.taskList = taskList;
        this.taskListCopy = Object.assign(new TaskList(this.taskList.tasks, this.taskList.pagination), this.taskList);
        this.isLoading = false;
      }
    )
  }

  private getUserTasks(pageNo: number): void {
    this.authService.user.pipe(take(1)).subscribe(
      user => {
        if (!user) {
          return;
        }

        this.taskService.getAllUserTasks(new GetUserTasks(user.id, pageNo, 5)).subscribe(
          taskList => {
            this.taskList = taskList;
            this.taskListCopy = Object.assign(new TaskList(this.taskList.tasks, this.taskList.pagination), this.taskList);
            this.isLoading = false;
          },
          error => {
            this.error = error.error.message;
            this.isLoading = false;
          }
        )
      }
    )
  }

  private getCurrentUserId(): void {
    this.authService.user.subscribe(
      user => {
        if (!user) {
          return;
        }

        this.currentUserId = user.id;
      }
    )
  }
}
