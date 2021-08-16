import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from './notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) {
  }

  getAllUserNotifications(userId: number): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${ environment.endpoints.notification.getAllUserNotifications }/${ userId }`);
  }

  clearAllUserNotifications(userId: number): Observable<any> {
    return this.httpClient.delete(`${ environment.endpoints.notification.clearAllUserNotifications }/${ userId }`);
  }
}
