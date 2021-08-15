export class CreateProject {

  constructor(public name: string, public description: string, public startAt: Date, public endAt: Date, public managerId: number) {
  }
}
