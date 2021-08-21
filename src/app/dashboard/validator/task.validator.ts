import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TaskType } from '../task/task-type.enum';

export class TaskValidator {

  static validateMaxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (control) {
        let value = control.value.trim();

        if (value.length < maxLength) {
          return null;
        }
      }

      return { invalidLength: true };
    }
  }

  static validateType(control: AbstractControl): ValidationErrors | null {
    if (control) {
      let valid: boolean = false;
      for (const type of Object.keys(TaskType)) {
        if (control.value == type) {
          valid = true;
          break;
        }
      }

      if (valid) {
        return null;
      }
    }

    return { invalidType: true };
  }
}
