import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';
import { TaskType } from '../task-type.enum';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  isLoading: boolean;
  error: string;

  @Input() loadProjectTasks: boolean;

  @Input() isManaged : boolean;

  @Input() tasks: Task[];

  constructor(private authService: AuthService, private taskService: TaskService) {
    this.loadProjectTasks = false;
    this.isManaged = false;
    this.isLoading = true;
    this.error = '';
    this.tasks = [];
  }

  ngOnInit(): void {
    if (this.loadProjectTasks) {
      console.log(this.tasks);
      this.isLoading = false;
    } else {
      this.authService.user.pipe(take(1)).subscribe(
        user => {
          if (!user) {
            return;
          }

          this.taskService.getAllUserTasks(user.id).subscribe(
            tasks => {
              this.tasks = tasks;
              this.isLoading = false;
            },
            error => {
              this.error = error.error.message;
              this.isLoading = false;
            }
          )
        }, error => {

        }
      )
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
}
