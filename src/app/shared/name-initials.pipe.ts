import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials'
})
export class NameInitialsPipe implements PipeTransform {

  transform(value: string): string {
    let initials = '';
    const words = value.split(' ');

    for (let word of words) {
      initials += word.charAt(0).toUpperCase();
    }

    return initials;
  }

}
