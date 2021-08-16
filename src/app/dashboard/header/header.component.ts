import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/user/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User | null;
  notificationCount: number;
  expandNotification: boolean;

  constructor(private authService: AuthService) {
    this.user = null;
    this.notificationCount = 0;
    this.expandNotification = false;
  }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  onUpdateNotificationCount(count: number): void {
    this.notificationCount = count;
  }

  onToggleNotification(): void {
    this.expandNotification = !this.expandNotification;
  }
}
