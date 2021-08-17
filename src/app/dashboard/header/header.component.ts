import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/user/user.model';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User | undefined;
  notificationCount: number;
  expandNotification: boolean;
  expandDropdown: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.notificationCount = 0;
    this.expandNotification = this.expandDropdown = false;
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

  onLogout(): void {
    this.authService.user.next(undefined);
    localStorage.removeItem('user');
    this.router.navigate(['/auth']).finally();
  }
}
