import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filter: BehaviorSubject<string | null>;

  constructor() {
    this.filter = new BehaviorSubject<string | null>(null);
  }
}
