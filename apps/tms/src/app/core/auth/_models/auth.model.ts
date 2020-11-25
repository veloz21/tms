import { Auth } from '../_interfaces/auth.interface';
export class AuthModel implements Auth {
  accessToken: string;
  refreshToken: string;

  constructor(auth?: Partial<Auth>) {
    this.accessToken = auth && auth.accessToken || '';
    this.refreshToken = auth && auth.refreshToken || '';
  }
}
