import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from '../../../environments/environment';
import { UsersService } from '../admin/users';
import { UserDocument } from '../admin/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  getJwtTokens(id: number, email: string, company) {
    const payload = { sub: id, email, company };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m', secret: environment.ACCESS_TOKEN_SECRET });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h', secret: environment.REFRESH_TOKEN_SECRET });
    return { accessToken, refreshToken };
  }

  decodeRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: environment.REFRESH_TOKEN_SECRET });
    } catch (error) {
      return null;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && user.comparePassword(password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {

    const { accessToken, refreshToken } = this.getJwtTokens(user.id, user.email, user.company);

    const updatedUser = await this.usersService.partialUpdate(user.id, {
      lastLogin: new Date(),
      refreshToken,
    }, { company: user.company });

    return { accessToken, refreshToken };
  }

  async logout(userId: string, company) {

    const user = await this.usersService.findOne(userId, { company });
    if (user) {
      const updatedUser = await this.usersService.partialUpdate(user.id, {
        refreshToken: null,
      }, { company: user.company });
    }

    return;
  }

  async generateRecoverToken(user: UserDocument) {
    return this.jwtService.sign({ email: user.email, sub: user.id, company: user.company }, { expiresIn: '24h', secret: environment.RECOVER_TOKEN_SECRET });
  }

  async validateRecoverToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: environment.RECOVER_TOKEN_SECRET });
    } catch (error) {
      return null;
    }
  }
}
