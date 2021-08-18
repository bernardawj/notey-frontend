import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project.model';
import { environment } from '../../../environments/environment';
import { retry } from 'rxjs/operators';
import { CreateProject } from '../../model/project/create-project.model';
import { UpdateProject } from '../../model/project/update-project.model';
import { AssignProject } from '../../model/project/assign-project.model';
import { ProjectAcceptance } from '../../shared/model/project-acceptance.model';
import { ProjectList } from './project-list.model';
import { GetAssignedProjects } from '../../model/project/get-assigned-projects.model';
import { RemoveProjectAssignment } from '../../model/project/remove-project-assignment.model';
import { GetManagedProjects } from '../../model/project/get-managed-projects.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getAllManagedProjects(getManagedProjects: GetManagedProjects): Observable<ProjectList> {
    return this.httpClient.post<ProjectList>(environment.endpoints.project.getAllManagedProjects, getManagedProjects);
  }

  getAllAssignedProjects(getAssignedProjects: GetAssignedProjects): Observable<ProjectList> {
    return this.httpClient.post<ProjectList>(environment.endpoints.project.getAllAssignedProjects, getAssignedProjects);
  }

  getProject(projectId: number, userId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${ environment.endpoints.project.getProject }/${ projectId }/${ userId }`);
  }

  createProject(project: CreateProject): Observable<Project> {
    return this.httpClient.post<Project>(environment.endpoints.project.createProject, project);
  }

  updateProject(project: UpdateProject): Observable<Project> {
    return this.httpClient.put<Project>(environment.endpoints.project.updateProject, project);
  }

  assignProject(assignProject: AssignProject): Observable<any> {
    return this.httpClient.post(environment.endpoints.project.assignUserToProject, assignProject);
  }

  removeUserFromProject(removeProjectAssignment: RemoveProjectAssignment): Observable<any> {
    return this.httpClient.post(environment.endpoints.project.removeUserFromProject, removeProjectAssignment);
  }

  updateProjectAcceptance(projectAcceptance: ProjectAcceptance): Observable<any> {
    return this.httpClient.post(environment.endpoints.project.updateProjectAcceptance, projectAcceptance);
  }
}
