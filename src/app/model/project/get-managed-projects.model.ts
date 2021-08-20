import { BaseList } from '../../shared/model/base-list.model';
import { Filter } from '../../shared/model/filter/filter.model';
import { InputPage } from '../../shared/model/input-page.model';

export class GetManagedProjects extends BaseList<Filter> {

  constructor(public managerId: number, public filter: Filter, public inputPage: InputPage) {
    super(filter, inputPage);
  }
}
