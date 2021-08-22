import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HamburgerService } from '../header/hamburger/hamburger.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/user/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  user: User | null;
  subscriptions: Subscription[];

  @HostListener('window:resize', ['$event']) onResize() {
    this.resetElements();
  }

  constructor(private authService: AuthService, private hamburgerService: HamburgerService, private elementRef: ElementRef) {
    this.user = null;
    this.subscriptions = [];
  }

  // Angular lifecycles

  ngOnInit(): void {
    this.loadUserSubscription();
    this.loadHamburgerSubscription();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  // Events

  onLogout(): void {
    this.authService.logout();
  }

  // Private methods

  private resetElements(): void {
    if (window.outerWidth >= 1024) {
      this.elementRef.nativeElement.querySelector('#sidebar').setAttribute('style', '');
    }
  }

  private loadUserSubscription(): void {
    const authSub: Subscription = this.authService.auth.subscribe(
      auth => {
        if (auth) {
          this.user = auth.user;
        }
      }
    )

    this.subscriptions.push(authSub);
  }

  private loadHamburgerSubscription(): void {
    const hamburgerSub: Subscription = this.hamburgerService.expandEmitter.subscribe(
      expand => {
        if (window.outerWidth < 1024) {
          const nav = this.elementRef.nativeElement.querySelector('#sidebar');
          if (expand) {
            nav.style.display = 'block';
          } else{
            nav.style.display = 'none';
          }
        }
      }
    );

    this.subscriptions.push(hamburgerSub);
  }
}
