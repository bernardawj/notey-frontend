import { InputPage } from './input-page.model';
import { Sort } from '../sort/sort.model';

export abstract class BaseList<Filter> {

  protected constructor(public filter: Filter, public sort: Sort, public inputPage: InputPage) {
  }
}
