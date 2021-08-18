import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from './notification.service';
import { take } from 'rxjs/operators';
import { Notification } from './notification.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AlertService } from '../../shared/alert/alert.service';
import { Alert } from '../../shared/alert/alert.model';
import { AlertType } from '../../shared/alert/alert-type.enum';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: '1'
      })),
      state('close', style({
        opacity: '0',
        display: 'none'
      })),
      transition('open => close', [
        animate('0.5s')
      ]),
      transition('close => open', [
        animate('0.5s')
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {

  notifications: Notification[];
  isLoading: boolean;

  @Input() expandNotification: boolean;

  @Output() notificationNumberEmitter: EventEmitter<number>;

  constructor(private authService: AuthService, private alertService: AlertService, private notificationService: NotificationService) {
    this.notifications = [];
    this.notificationNumberEmitter = new EventEmitter<number>();
    this.isLoading = true;
    this.expandNotification = false;
  }

  ngOnInit(): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      this.getAllUserNotifications(user.id);
      this.silentRefreshNotification(user.id);
    });
  }

  onClearAll(): void {
    this.authService.user.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      this.notificationService.clearAllUserNotifications(user.id).subscribe(
        () => {
          this.getAllUserNotifications(user.id);
          this.alertService.alertSubject.next(new Alert(`All notifications are cleared.`, AlertType.SUCCESS));
        }, error => {
          this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
        });
    });
  }

  private getAllUserNotifications(userId: number): void {
    this.notificationService.getAllUserNotifications(userId).subscribe(
      notifications => {
        this.notifications = notifications;
        this.notificationNumberEmitter.emit(this.notifications.length);
        this.isLoading = false;
      }, error => {
        this.alertService.alertSubject.next(new Alert(error.error.message, AlertType.DANGER));
      });
  }

  private silentRefreshNotification(userId: number): void {
    setInterval(() => {
      this.getAllUserNotifications(userId);
    }, 10000);
  }
}
