import { Filter } from './filter.model';
import { TaskType } from '../../../dashboard/task/task-type.enum';

export class TaskFilter extends Filter {

  constructor(public searchString: string, public type: TaskType | null, public completed: boolean | null) {
    super(searchString);
  }
}
