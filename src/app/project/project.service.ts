import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getAllManagedProjects(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${environment.endpoints.project.getAllManagedProjects}/${userId}`);
  }
}
