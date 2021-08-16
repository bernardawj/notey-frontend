import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User | null;

  constructor(private httpClient: HttpClient) {
    this.user = null;
  }

  getUserDetails(): Observable<User> {
    return this.httpClient.get<User>(`${ environment.endpoints.user.getUserDetails }/2`);
  }
}
