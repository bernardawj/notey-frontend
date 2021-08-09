import { User } from '../shared/user.model';

export class Project {

  id: number;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;
  manager: User;
  users: User[];

  constructor(id: number, name: string, description: string, startAt: Date, endAt: Date, manager: User, users: User[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startAt = startAt;
    this.endAt = endAt;
    this.manager = manager;
    this.users = users;
  }
}
