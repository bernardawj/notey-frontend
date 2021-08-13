import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User>;

  constructor(private httpClient: HttpClient) {
    this.user = new BehaviorSubject<User>(new User(0, 'test@test.com', 'test123', '', ''));
  }

  login(email: string, password: string): Observable<User> {
    return this.httpClient.post<User>(environment.endpoints.auth.login, {
      email: email,
      password: password
    });
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(environment.endpoints.auth.register, user);
  }
}
