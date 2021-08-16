import { TaskType } from './task-type.enum';
import { Project } from '../project/project.model';
import { User } from '../../shared/user/user.model';

export class Task {

  constructor(public id: number, public name: string, public description: string, public type: TaskType,
              public isCompleted: boolean, public startAt: Date, public endAt: Date, public createdAt: Date,
              public project: Project, public user: User) {
  }
}
