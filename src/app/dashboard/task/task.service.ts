import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { environment } from '../../../environments/environment';
import { TaskList } from './task-list.model';
import { GetProjectTasks } from '../../model/task/get-project-tasks.model';
import { GetUserTasks } from '../../model/task/get-user-tasks.model';
import { CreateTask } from '../../model/task/create-task.model';
import { AssignTask } from '../../model/task/assign-task.model';
import { UpdateTask } from '../../model/task/update-task.model';
import { GetTask } from '../../model/task/get-task.model';

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

  getTask(getTask: GetTask): Observable<Task> {
    return this.httpClient.get<Task>(`${ environment.endpoints.task.getTask }/${ getTask.taskId }/${ getTask.userId }`);
  }

  createTask(createTask: CreateTask): Observable<Task> {
    return this.httpClient.post<Task>(environment.endpoints.task.createTask, createTask);
  }

  updateTask(updateTask: UpdateTask): Observable<Task> {
    return this.httpClient.put<Task>(environment.endpoints.task.updateTask, updateTask);
  }

  updateTaskAssignment(assignTask: AssignTask): Observable<any> {
    return this.httpClient.post(environment.endpoints.task.assignTaskToUser, assignTask);
  }

  deleteTask(taskId: number, managerId: number): Observable<any> {
    return this.httpClient.delete(`${ environment.endpoints.task.deleteTask }/${ taskId }/${ managerId }`);
  }
}
