import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (user) {
        const modifiedRequest: HttpRequest<any> = req.clone({
          headers: new HttpHeaders().set('Authorization', `Basic ${btoa(`${user.email}:${user.password}`)}`)
        });
        return next.handle(modifiedRequest);
      } else {
        return next.handle(req);
      }
    }));
  }
}
