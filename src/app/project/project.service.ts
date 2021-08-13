import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../../environments/environment';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getAllManagedProjects(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${ environment.endpoints.project.getAllManagedProjects }/${ userId }`).pipe(retry(3));
  }

  getAllAssignedProjects(userId: number): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${ environment.endpoints.project.getAllAssignedProjects }/${ userId }`).pipe(retry(3));
  }

  getProject(projectId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${ environment.endpoints.project.getProject }/${ projectId }`).pipe(retry(3));
  }

  createProject(project: Project): Observable<Project> {
    return this.httpClient.post<Project>(environment.endpoints.project.createProject, project).pipe(retry(3));
  }

  updateProject(project: Project): Observable<Project> {
    return this.httpClient.put<Project>(environment.endpoints.project.updateProject, project).pipe(retry(3));
  }
}
