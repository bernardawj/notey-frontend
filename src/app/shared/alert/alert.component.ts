import { Component, ElementRef, OnInit } from '@angular/core';
import { AlertService } from './alert.service';
import { Alert } from './alert.model';
import { AlertType } from './alert-type.enum';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  alert: Alert | null;
  alertClass: string;

  fadeAlertTimeout: any;
  hideAlertTimeout: any;

  constructor(private alertService: AlertService, private elementRef: ElementRef) {
    this.alert = null;
    this.alertClass = '';
  }

  ngOnInit(): void {
    this.alertService.alertEmitter.subscribe(
      alert => {
        if (this.fadeAlertTimeout) {
          clearTimeout(this.fadeAlertTimeout);
          this.fadeAlertTimeout = null;
        }

        if (this.hideAlertTimeout) {
          clearTimeout(this.hideAlertTimeout);
          this.hideAlertTimeout = null;
        }

        this.alert = alert;
        this.setAlertClass(this.alert.type);

        this.fadeAlertTimeout = setTimeout(() => {
          this.alertClass += ' alert--fade';
        }, 5000);

        this.hideAlertTimeout = setTimeout(() => {
          this.alert = null;
        }, 6000);
      }
    )
  }

  setAlertClass(alertType: AlertType): void {
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
}
