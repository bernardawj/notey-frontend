import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css']
})
export class AuthComponent implements OnInit {

  expandDescription: boolean;

  @HostListener('window:resize', ['$event']) onResize() {
    this.resetElements();
  }

  constructor() {
    this.expandDescription = true;
  }

  ngOnInit(): void {
  }

  toggleDescription(): void {
    this.expandDescription = !this.expandDescription;
  }

  private resetElements(): void {
    if (window.outerWidth >= 1024) {
      this.expandDescription = false;
    }
  }
}
