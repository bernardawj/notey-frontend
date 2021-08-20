import { Filter } from './filter.model';

export class ProjectFilter extends Filter {

  constructor(public searchString: string) {
    super(searchString);
  }
}
