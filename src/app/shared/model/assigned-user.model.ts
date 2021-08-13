export class AssignedUser {

  constructor(public userId: number, public email: string, public firstName: string, public lastName: string,
              public hasAccepted: boolean) {
  }
}
