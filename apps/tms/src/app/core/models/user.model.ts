import { IUser } from '@bits404/api-interfaces';

export class UserModel implements IUser {
  id?: any;
  email: string;
  password: string;
  lastLogin: Date;
  refreshToken: string;

  constructor(user?: Partial<IUser>) {
    if (!user) {
      return;
    }

    this.email = user.email || '';
    this.password = user.password || undefined;
    this.lastLogin = user.lastLogin || null;
    this.refreshToken = user.refreshToken || null;
  }
}