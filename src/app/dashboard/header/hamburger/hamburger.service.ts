import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HamburgerService {

  @Output() expandEmitter: EventEmitter<boolean>;

  constructor() {
    this.expandEmitter = new EventEmitter<boolean>();
  }
}
