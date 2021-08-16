import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from './notification.service';
import { take } from 'rxjs/operators';
import { Notification } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[];
  isLoading: boolean;
  error: string;
  success: string;

  @Input() expandNotification: boolean;

  @Output() notificationNumberEmitter: EventEmitter<number>;

  constructor(private authService: AuthService, private notificationService: NotificationService) {
    this.notifications = [];
    this.notificationNumberEmitter = new EventEmitter<number>();
    this.isLoading = true;
    this.expandNotification = false;
    this.error = this.success = '';
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
          this.success = 'All notifications are cleared.';
          this.hideAlert();
        }, error => {
          this.error = error.error.message;
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
        this.error = error.error.message;
      });
  }

  private silentRefreshNotification(userId: number): void {
    setInterval(() => {
      this.getAllUserNotifications(userId);
    }, 10000);
  }

  private hideAlert(): void {
    setTimeout(() => {
      this.success = '';
    }, 3000)
  }
}
