import { User } from '../shared/user.model';

export class Project {

  constructor(public id: number, public name: string, public description: string, public startAt: Date,
              public endAt: Date, public manager: User, public users: User[]) {
  }
}
