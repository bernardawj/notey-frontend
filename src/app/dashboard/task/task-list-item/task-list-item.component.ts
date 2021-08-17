import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { TaskType } from '../task-type.enum';
import { TaskList } from '../task-list.model';
import { ActivatedRoute } from '@angular/router';
import { GetProjectTasks } from '../../../model/task/get-project-tasks.model';
import { GetUserTasks } from '../../../model/task/get-user-tasks.model';
import { Project } from '../../project/project.model';
import { Task } from '../task.model';
import { ProjectList } from '../../project/project-list.model';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css']
})
export class TaskListItemComponent implements OnInit {

  isLoading: boolean;
  error: string;

  @Input() loadProjectTasks: boolean;

  @Input() isManaged: boolean;

  taskList: TaskList | null;
  taskListCopy: TaskList | null;

  constructor(private authService: AuthService, private taskService: TaskService, private activatedRoute: ActivatedRoute) {
    this.loadProjectTasks = false;
    this.isManaged = false;
    this.isLoading = true;
    this.error = '';
    this.taskList = this.taskListCopy = null;
  }

  ngOnInit(): void {
    if (this.loadProjectTasks) {
      this.getProjectTasks(1);
    } else {
      this.getUserTasks(1);
    }
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

  taskSize(): number {
    if (this.taskList?.tasks) {
      return this.taskList.tasks.length;
    } else {
      return 0;
    }
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
}
