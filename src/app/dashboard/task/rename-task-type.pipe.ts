import { Pipe, PipeTransform } from '@angular/core';
import { TaskType } from './task-type.enum';

@Pipe({
  name: 'renameTaskType'
})
export class RenameTaskTypePipe implements PipeTransform {

  transform(value: TaskType, ...args: any[]): string {
    let stringValue = '';

    if (value == TaskType.URGENT) {
      stringValue = 'Urgent';
    } else if (value == TaskType.NON_URGENT) {
      stringValue = 'Non-Urgent';
    }

    return stringValue;
  }
}
