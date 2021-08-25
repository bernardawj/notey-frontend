import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.auth) {
      return this.authService.auth.pipe(take(1), exhaustMap(auth => {
        if (auth) {
          if (!auth.token.accessToken) {
            this.authService.logout(true);
          }

          const modifiedRequest: HttpRequest<any> = req.clone({
            headers: new HttpHeaders().set('Authorization', `Bearer ${ auth.token.accessToken }`)
          });
          return next.handle(modifiedRequest);
        } else {
          return next.handle(req);
        }
      }));
    } else {
      return next.handle(req);
    }
  }
}
