import { SortType } from './sort-type.enum';

export class Sort {

  constructor(public by: string, public type: SortType) {
  }
}
