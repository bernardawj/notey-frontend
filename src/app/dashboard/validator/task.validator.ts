import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TaskType } from '../task/task-type.enum';

export class TaskValidator {

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
