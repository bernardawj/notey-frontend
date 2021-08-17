import { Pagination } from '../../shared/model/pagination.model';
import { Task } from './task.model';

export class TaskList {

  constructor(public tasks: Task[], public pagination: Pagination) {
  }
}
