import { Directive, ElementRef, HostListener } from '@angular/core';
import { HamburgerService } from './hamburger.service';

@Directive({
  selector: '[appHamburger]'
})
export class HamburgerDirective {

  openClass: string;

  @HostListener('window:resize', ['$event']) onResize() {
    this.resetElements();
  }

  @HostListener('click', ['$event']) onToggle() {
    const currentEl = this.elementRef.nativeElement;

    currentEl.classList.toggle(this.openClass);
    if (currentEl.classList.contains(this.openClass)) {
      this.hamburgerService.expandEmitter.emit(true);
    } else {
      this.hamburgerService.expandEmitter.emit(false);
    }
  }

  constructor(private hamburgerService: HamburgerService, private elementRef: ElementRef) {
    this.openClass = 'hamburger--open';
  }

  private resetElements(): void {
    if (window.outerWidth >= 1024) {
      this.elementRef.nativeElement.classList.remove(this.openClass);
    }
  }
}
