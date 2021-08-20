import { BaseList } from '../../shared/model/base-list.model';
import { TaskFilter } from '../../shared/model/filter/task-filter.model';
import { InputPage } from '../../shared/model/input-page.model';

export class GetUserTasks extends BaseList<TaskFilter> {

  constructor(public userId: number, public filter: TaskFilter, public inputPage: InputPage) {
    super(filter, inputPage);
  }
}
