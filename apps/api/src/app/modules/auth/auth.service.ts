import { Injectable } from '@nestjs/common';
// import { environment } from '../../../../environments/environment';
// import { User, UserDocument } from '../../entities';
// import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  // constructor(
  //   private userService: UserService,
  //   private jwtService: JwtService,
  // ) { }

  // getJwtTokens(id: number, email: string) {
  //   const payload = { email: email, sub: id };

  //   const accessToken = this.jwtService.sign(payload);
  //   const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h', secret: environment.REFRESH_TOKEN_SECRET });
  //   return { accessToken, refreshToken };
  // }

  // decodeRefreshToken(token: string) {
  //   try {
  //     return this.jwtService.verify(token, { secret: environment.REFRESH_TOKEN_SECRET });
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.userService.findOneByEmail(email);
  //   if (user && user.comparePassword(password)) {
  //     delete user.password;
  //     return user;
  //   }
  //   return null;
  // }

  // async login(user: UserDocument) {

  //   const { accessToken, refreshToken } = this.getJwtTokens(user.id, user.email);

  //   const updatedUser = await User.update(user.id, {
  //     $set: {
  //       lastLogin: new Date(),
  //       refreshToken,
  //     }
  //   });

  //   return { accessToken, refreshToken };
  // }

  // async logout(userId: string) {

  //   const user = await User.findById(userId);
  //   if (user) {
  //     const updatedUser = await User.update(user.id, {
  //       refreshToken: null,
  //     });
  //   }

  //   return;
  // }

  // async generateRecoverToken(user: UserDocument) {
  //   return this.jwtService.sign({ email: user.email, sub: user.id }, { expiresIn: '24h', secret: environment.RECOVER_TOKEN_SECRET });
  // }

  // async validateRecoverToken(token: string) {
  //   try {
  //     return this.jwtService.verify(token, { secret: environment.RECOVER_TOKEN_SECRET });
  //   } catch (error) {
  //     return null;
  //   }
  // }
}
