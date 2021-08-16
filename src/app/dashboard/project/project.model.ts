import { User } from '../../shared/user/user.model';
import { AssignedUser } from '../../shared/model/assigned-user.model';
import { Task } from '../task/task.model';

export class Project {

  constructor(public id: number, public name: string, public description: string, public startAt: Date,
              public endAt: Date, public manager: User, public assignedUsers: AssignedUser[], public tasks: Task[]) {
  }
}
