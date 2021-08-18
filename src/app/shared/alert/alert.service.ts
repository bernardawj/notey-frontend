import { EventEmitter, Injectable, Output } from '@angular/core';
import { Alert } from './alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  @Output() alertEmitter: EventEmitter<Alert>

  constructor() {
    this.alertEmitter = new EventEmitter<Alert>();
  }
}
