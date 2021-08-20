import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '../model/auth/auth.model';
import { Login } from '../model/auth/login.model';
import { Token } from '../model/auth/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: BehaviorSubject<Auth | null>;

  constructor(private httpClient: HttpClient) {
    this.auth = new BehaviorSubject<Auth | null>(null);
  }

  login(login: Login): Observable<Auth> {
    return this.httpClient.post<Auth>(environment.endpoints.auth.login, login);
  }

  autoLogin(): void {
    const userData = JSON.parse(<string>localStorage.getItem('auth'));

    if (userData) {
      const user: User = new User(userData.user.id, userData.user.email, userData.user.password, userData.user.firstName, userData.user.lastName);
      const token: Token = new Token(userData.token.accessToken);
      const auth = new Auth(user, token);
      this.auth.next(auth);
    }
  }

  // register(user: User): Observable<User> {
  //   return this.httpClient.post<User>(environment.endpoints.auth.register, user);
  // }

  logout(): void {
    if (this.auth) {
      this.auth.unsubscribe();
      this.auth.next(null);
    }
  }
}
