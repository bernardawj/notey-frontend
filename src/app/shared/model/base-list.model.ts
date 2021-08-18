import { InputPage } from './input-page.model';
import { Filter } from './filter.model';

export class BaseList {

  constructor(public filter: Filter, public inputPage: InputPage) {
  }
}
