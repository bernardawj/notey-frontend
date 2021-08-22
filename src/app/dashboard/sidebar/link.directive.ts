import { Directive, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appLink]'
})
export class LinkDirective {

  @HostListener('click', ['$event']) onClick() {
    const hamburgerEl = this.document.getElementById('hamburger');
    if (hamburgerEl) {
      hamburgerEl.click();
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
  }
}
