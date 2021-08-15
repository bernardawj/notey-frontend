import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user.model';
import { environment } from '../../../environments/environment';
import { ProjectAcceptance } from '../model/project-acceptance.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User | null;

  constructor(private httpClient: HttpClient) {
    this.user = null;
  }

  getUserDetails(): Observable<User> {
    return this.httpClient.get<User>(`${environment.endpoints.user.getUserDetails}/2`);
  }

  updateProjectAcceptance(projectAcceptance: ProjectAcceptance): Observable<any> {
    return this.httpClient.post(`${environment.endpoints.user.updateProjectAcceptance}`, projectAcceptance);
  }
}
