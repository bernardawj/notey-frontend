import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../../../environments/environment';
import { retry } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { CreateProject } from '../../model/project/create-project.model';
import { UpdateProject } from '../../model/project/update-project.model';
import { AssignProject } from '../../model/project/assign-project.model';
import { ProjectAcceptance } from '../../shared/model/project-acceptance.model';
import { ProjectList } from './project-list.model';
import { GetManagedProjects } from '../../model/project/get-managed-projects.model';
import { GetAssignedProjects } from '../../model/project/get-assigned-projects.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  getAllManagedProjects(getManagedProjects: GetManagedProjects): Observable<ProjectList> {
    return this.httpClient.get<ProjectList>(`${ environment.endpoints.project.getAllManagedProjects }/${ getManagedProjects.managerId }/${ getManagedProjects.pageNo }/${ getManagedProjects.pageSize }`).pipe(retry(3));
  }

  getAllAssignedProjects(getAssignedProjects: GetAssignedProjects): Observable<ProjectList> {
    return this.httpClient.get<ProjectList>(`${ environment.endpoints.project.getAllAssignedProjects }/${ getAssignedProjects.userId }/${ getAssignedProjects.pageNo }/${ getAssignedProjects.pageSize }`).pipe(retry(3));
  }

  getProject(projectId: number, userId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${ environment.endpoints.project.getProject }/${ projectId }/${ userId }`).pipe(retry(3));
  }

  createProject(project: CreateProject): Observable<Project> {
    return this.httpClient.post<Project>(environment.endpoints.project.createProject, project).pipe(retry(3));
  }

  updateProject(project: UpdateProject): Observable<Project> {
    return this.httpClient.put<Project>(environment.endpoints.project.updateProject, project).pipe(retry(3));
  }

  assignProject(assignProject: AssignProject): Observable<any> {
    return this.httpClient.post(environment.endpoints.project.assignUserToProject, assignProject);
  }

  updateProjectAcceptance(projectAcceptance: ProjectAcceptance): Observable<any> {
    return this.httpClient.post(environment.endpoints.project.updateProjectAcceptance, projectAcceptance);
  }
}
