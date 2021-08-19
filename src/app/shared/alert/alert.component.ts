import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from './alert.service';
import { Alert } from './alert.model';
import { AlertType } from './alert-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  alert: Alert | null;
  alertClass: string;
  fadeAlertTimeout: any;
  hideAlertTimeout: any;
  alertSub: Subscription | undefined;

  constructor(private alertService: AlertService) {
    this.alert = null;
    this.alertClass = '';
  }

  // Angular lifecycles

  ngOnInit(): void {
    this.alertSub = this.alertService.alertSubject.subscribe(
      alert => {
        if (alert) {
          this.clearTimeouts();
          this.setAlerts(alert);
          this.setTimeouts();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }

  // Private methods

  private setAlerts(alert: Alert): void {
    this.alert = alert;
    this.setAlertClass(this.alert.type);
  }

  private setAlertClass(alertType: AlertType): void {
    if (alertType === AlertType.INFO) {
      this.alertClass = 'alert alert--info';
    } else if (alertType === AlertType.DANGER) {
      this.alertClass = 'alert alert--danger';
    } else if (alertType === AlertType.SUCCESS) {
      this.alertClass = 'alert alert--success';
    } else {
      this.alertClass = 'alert';
    }
  }

  private clearTimeouts(): void {
    if (this.fadeAlertTimeout) {
      clearTimeout(this.fadeAlertTimeout);
      this.fadeAlertTimeout = null;
    }

    if (this.hideAlertTimeout) {
      clearTimeout(this.hideAlertTimeout);
      this.hideAlertTimeout = null;
    }
  }

  private setTimeouts(): void {
    this.fadeAlertTimeout = setTimeout(() => {
      this.alertClass += ' alert--fade';
    }, 5000);

    this.hideAlertTimeout = setTimeout(() => {
      this.alert = null;
    }, 6000);
  }
}
