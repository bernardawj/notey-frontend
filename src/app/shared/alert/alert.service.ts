import { EventEmitter, Injectable, Output } from '@angular/core';
import { Alert } from './alert.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertSubject: BehaviorSubject<Alert | null>;

  constructor() {
    this.alertSubject = new BehaviorSubject<Alert | null>(null);
  }
}
