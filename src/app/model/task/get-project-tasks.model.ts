import { BaseList } from '../../shared/model/base-list.model';
import { Filter } from '../../shared/model/filter.model';
import { InputPage } from '../../shared/model/input-page.model';

export class GetProjectTasks extends BaseList {

  constructor(public projectId: number, public filter: Filter, public inputPage: InputPage) {
    super(filter, inputPage);
  }
}
