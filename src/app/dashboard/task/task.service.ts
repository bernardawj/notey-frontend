import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) {
  }

  getAllUserTasks(userId: number): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${ environment.endpoints.task.getAllUserTasks }/${ userId }`);
  }
}
