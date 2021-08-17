import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { environment } from '../../../environments/environment';
import { TaskList } from './task-list.model';
import { GetProjectTasks } from '../../model/task/get-project-tasks.model';
import { GetUserTasks } from '../../model/task/get-user-tasks.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  getAllUserTasks(getUserTasks: GetUserTasks): Observable<TaskList> {
    return this.httpClient.get<TaskList>(`${ environment.endpoints.task.getAllUserTasks }/${ getUserTasks.userId }/${ getUserTasks.pageNo }/${ getUserTasks.pageSize }`);
  }

  getAllProjectTasks(getProjectTasks: GetProjectTasks): Observable<TaskList> {
    return this.httpClient.get<TaskList>(
      `${ environment.endpoints.task.getAllProjectTasks }/${ getProjectTasks.projectId }/${ getProjectTasks.pageNo }/${ getProjectTasks.pageSize }`);
  }
}
