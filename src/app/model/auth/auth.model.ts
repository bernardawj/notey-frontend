import { User } from '../../shared/user/user.model';
import { Token } from './token.model';

export class Auth {

  constructor(public user: User, public token: Token) {
  }
}
