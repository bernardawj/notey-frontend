import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { AuthService } from '../../../auth/auth.service';
import { take } from 'rxjs/operators';

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

  @Input() tasks: Task[] | undefined;

  constructor(private authService: AuthService, private taskService: TaskService) {
    this.loadProjectTasks = false;
    this.isManaged = false;
    this.isLoading = true;
    this.error = '';
    this.tasks = [];
  }

  ngOnInit(): void {
    if (this.loadProjectTasks) {
      // Call the tasks service to populate
      console.log(this.tasks);
      if (this.tasks && this.tasks.length === 0) {
        this.isLoading = false;
      }
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
}
