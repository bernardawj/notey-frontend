import { TaskType } from '../../dashboard/task/task-type.enum';

export class UpdateTask {

  constructor(public taskId: number, public name: string, public description: string, public type: TaskType,
              public completed: boolean, public startAt: Date, public endAt: Date, public managerId: number) {
  }
}
