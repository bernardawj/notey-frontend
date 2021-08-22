import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../shared/user/user.model';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../shared/alert/alert.model';
import { AlertType } from '../../shared/alert/alert-type.enum';
import { AlertService } from '../../shared/alert/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User | undefined;
  notificationCount: number;
  expandNotification: boolean;
  expandDropdown: boolean;

  subscriptions: Subscription[];

  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) {
    this.notificationCount = 0;
    this.expandNotification = this.expandDropdown = false;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    const authSub: Subscription = this.authService.auth.subscribe(
      auth => {
        if (auth) {
          this.user = auth.user;
        }
      });

    this.subscriptions.push(authSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  onUpdateNotificationCount(count: number): void {
    this.notificationCount = count;
  }

  onToggleNotification(): void {
    this.expandNotification = !this.expandNotification;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
