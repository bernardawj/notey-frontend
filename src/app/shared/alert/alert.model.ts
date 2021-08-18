import { AlertType } from './alert-type.enum';

export class Alert {

  constructor(public message: string, public type: AlertType) {
  }
}
