import { BaseList } from '../../shared/model/base-list.model';
import { InputPage } from '../../shared/model/input-page.model';
import { TaskFilter } from '../../shared/model/filter/task-filter.model';
import { Sort } from '../../shared/sort/sort.model';

export class GetProjectTasks extends BaseList<TaskFilter> {

  constructor(public projectId: number, public filter: TaskFilter, public sort: Sort, public inputPage: InputPage) {
    super(filter, sort, inputPage);
  }
}
