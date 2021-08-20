import { InputPage } from './input-page.model';

export abstract class BaseList<Filter> {

  protected constructor(public filter: Filter, public inputPage: InputPage) {
  }
}
