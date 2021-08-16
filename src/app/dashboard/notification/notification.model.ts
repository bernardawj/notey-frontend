import { NotificationType } from './notification-type.enum';
import { User } from '../../shared/user/user.model';

export class Notification {

  constructor(public id: number, public message: string, public type: NotificationType, public createdAt: Date,
              public fromUser: User, public toUser: User) {
  }
}
