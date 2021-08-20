import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from './notification.service';
import { take } from 'rxjs/operators';
import { Notification } from './notification.model';
import { AlertService } from '../../shared/alert/alert.service';
import { Alert } from '../../shared/alert/alert.model';
import { AlertType } from '../../shared/alert/alert-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  notifications: Notification[];
  isLoading: boolean;
  notificationInterval: any;
  userId: number | null;

  subscriptions: Subscription[];

  @Input() expandNotification: boolean;
  @Output() notificationNumberEmitter: EventEmitter<number>;

  constructor(private authService: AuthService, private alertService: AlertService, private notificationService: NotificationService) {
    this.notifications = [];
    this.notificationNumberEmitter = new EventEmitter<number>();
    this.isLoading = true;
    this.expandNotification = false;
    this.subscriptions = [];
    this.userId = null;
  }

  ngOnInit(): void {
    this.authService.auth.pipe(take(1)).subscribe(auth => {
      if (auth) {
        this.userId = auth.user.id;
        this.getAllUserNotifications(this.userId);
        this.silentRefreshNotification(this.userId);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationInterval);
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  onClearAll(): void {
    if (this.userId) {
      const clearNotificationsSub: Subscription = this.notificationService.clearAllUserNotifications(this.userId).subscribe(
        () => {
          this.getAllUserNotifications(this.userId!);
          this.alertService.alertSubject.next(new Alert(`All notifications are cleared.`, AlertType.SUCCESS));
        }, error => {
          this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        }
      );

      this.subscriptions.push(clearNotificationsSub);
    }
  }

  private getAllUserNotifications(userId: number): void {
    const getNotificationsSub: Subscription = this.notificationService.getAllUserNotifications(userId).subscribe(
      notifications => {
        this.notifications = notifications;
        this.notificationNumberEmitter.emit(this.notifications.length);
        this.isLoading = false;
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      }
    );

    this.subscriptions.push(getNotificationsSub);
  }

  private silentRefreshNotification(userId: number): void {
    this.notificationInterval = setInterval(() => {
      this.getAllUserNotifications(userId);
    }, 10000);
  }
}
