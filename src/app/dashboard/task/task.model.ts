import { TaskType } from './task-type.enum';
import { Project } from '../project/project.model';
import { User } from '../../shared/user/user.model';

export class Task {

  constructor(public id: number, public name: string, public description: string, public type: TaskType,
              isCompleted: boolean, startAt: Date, endAt: Date, createdAt: Date, project: Project, user: User) {
  }
}
