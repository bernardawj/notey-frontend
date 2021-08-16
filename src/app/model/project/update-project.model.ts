export class UpdateProject {

  constructor(public id: number, public name: string, public description: string, public startAt: Date, public endAt: Date,
              public managerId: number) {
  }
}
