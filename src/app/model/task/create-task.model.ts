import { TaskType } from '../../dashboard/task/task-type.enum';

export class CreateTask {

  constructor(public name: string, public description: string, public type: TaskType, public startAt: Date, public endAt: Date, public projectId: number) {
  }
}
