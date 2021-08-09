export class User {

  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string = '';

  constructor(id: number, email: string, firstName: string, lastName: string) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
