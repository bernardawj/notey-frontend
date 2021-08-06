export class Project {

  id: number;
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;

  constructor(id: number, name: string, description: string, startAt: Date, endAt: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
