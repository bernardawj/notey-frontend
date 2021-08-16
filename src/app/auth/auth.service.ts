import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User | null>;

  constructor(private httpClient: HttpClient) {
    this.user = new BehaviorSubject<User | null>(null);
  }

  login(email: string, password: string): Observable<User> {
    return this.httpClient.post<User>(environment.endpoints.auth.login, {
      email: email,
      password: password
    });
  }

  autoLogin(): void {
    const userData = JSON.parse(<string>localStorage.getItem('user'));

    if (!userData) {
      return;
    }

    const user = new User(userData.id, userData.email, userData.password, userData.firstName, userData.lastName);
    this.user.next(user);
  }

  // register(user: User): Observable<User> {
  //   return this.httpClient.post<User>(environment.endpoints.auth.register, user);
  // }

  logout(): void {
    if (this.user) {
      this.user.unsubscribe();
      this.user.next(new User(0, '', '', '', ''));
    }
  }
}
