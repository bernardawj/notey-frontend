import { BaseList } from '../../shared/model/base-list.model';
import { Filter } from '../../shared/model/filter.model';
import { InputPage } from '../../shared/model/input-page.model';

export class GetAssignedProjects extends BaseList {

  constructor(public userId: number, public filter: Filter, public inputPage: InputPage) {
    super(filter, inputPage);
  }
}
