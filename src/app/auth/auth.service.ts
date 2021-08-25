import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared/user/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '../model/auth/auth.model';
import { Login } from '../model/auth/login.model';
import { Token } from '../model/auth/token.model';
import { Router } from '@angular/router';
import { Alert } from '../shared/alert/alert.model';
import { AlertType } from '../shared/alert/alert-type.enum';
import { AlertService } from '../shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth: BehaviorSubject<Auth | null>;

  constructor(private alertService: AlertService, private httpClient: HttpClient, private router: Router) {
    this.auth = new BehaviorSubject<Auth | null>(null);
  }

  login(login: Login): Observable<Auth> {
    return this.httpClient.post<Auth>(environment.endpoints.auth.login, login);
  }

  autoLogin(): void {
    const userData = JSON.parse(<string>localStorage.getItem('auth'));

    if (userData) {
      const user: User = new User(userData.user.id, userData.user.email, userData.user.password, userData.user.firstName, userData.user.lastName);
      const token: Token = new Token(userData.token.accessToken, new Date(userData.token.expiryDate));

      if (token.accessToken) {
        const auth = new Auth(user, token);
        this.auth.next(auth);
      } else {
        this.logout(true);
      }
    }
  }

  // register(user: User): Observable<User> {
  //   return this.httpClient.post<User>(environment.endpoints.auth.register, user);
  // }

  logout(auto: boolean): void {
    if (this.auth) {
      this.auth.next(null);
      localStorage.removeItem('auth');

      if (auto) {
        this.alertService.alertSubject.next(new Alert('The authenticated session has expired. Please login again.', AlertType.INFO));
      } else {
        this.alertService.alertSubject.next(new Alert('Successfully logged out from your account', AlertType.SUCCESS));
      }

      this.router.navigate(['/auth']).finally();
    }
  }
}
