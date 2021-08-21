import { AbstractControl } from '@angular/forms';

export class FormUtility {

  static trimValues(controls: { [key: string]: AbstractControl }): void {
    Object.keys(controls).forEach(key => {
      controls[key].setValue(controls[key].value.trim());
    });
  }
}
