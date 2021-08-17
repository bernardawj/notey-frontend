import { Project } from './project.model';
import { Pagination } from '../../shared/model/pagination.model';

export class ProjectList {

  constructor(public projects: Project[], public pagination: Pagination) {
  }
}
