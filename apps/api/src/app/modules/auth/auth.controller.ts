import { Controller } from '@nestjs/common';

@Controller('')
export class AuthController {

  // constructor(
  //   private authService: AuthService,
  //   private userService: UserService,
  //   private readonly mailerService: MailerService,
  // ) { }

  // @Post('token')
  // @HttpCode(200)
  // async token(@Body('refreshToken') refreshToken) {

  //   Logger.log('token refreshToken');
  //   Logger.log(refreshToken);

  //   const payload = this.authService.decodeRefreshToken(refreshToken);
  //   if (!payload) {
  //     throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
  //   }

  //   const user = await this.userService.findOne(payload.sub);
  //   if (!user || user.refreshToken !== refreshToken) {
  //     throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  //   }

  //   const { accessToken } = this.authService.getJwtTokens(payload.sub, payload.email);
  //   return { accessToken };
  // }

  // @Post('register')
  // async register(@Body() user: Partial<IUser>, @Body('company') company: string) {

  //   const newCompany = new Company({
  //     _id: company,
  //   });
  //   await newCompany.save();

  //   if (!newCompany.id) {
  //     throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
  //   }

  //   const newUser = new User({
  //     ...user,
  //     company
  //   });
  //   newUser.hashPassword();

  //   if (!newUser.id) {
  //     throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
  //   }

  //   return;
  // }

  // @Post('login')
  // @HttpCode(200)
  // @UseGuards(LocalAuthGuard)
  // async login(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  // @Post('logout')
  // @HttpCode(200)
  // logout(@Request() req) {
  //   return this.authService.logout(req.userId || null);
  // }

  // @Post('recover-password')
  // @HttpCode(200)
  // async recoverPassword(@Body('email') email) {

  //   const user = await this.userService.findOneByEmail(email);
  //   if (!user) {
  //     throw new HttpException('No se encontró el usuario', HttpStatus.BAD_REQUEST);
  //   }

  //   const token = await this.authService.generateRecoverToken(user);
  //   const b64Token = Buffer.from(token).toString('base64');
  //   const b64Email = Buffer.from(email).toString('base64');

  //   return await this.mailerService.sendMail({
  //     to: email,
  //     subject: 'Recupera tu contraseña',
  //     template: EmailTemplate.RECOVER_PASSWORD, // The `.pug` or `.hbs` extension is appended automatically.
  //     context: {  // Data to be sent to template engine.
  //       token: b64Token,
  //       email: b64Email
  //     },
  //   });
  // }

  // @Post('change-password')
  // @HttpCode(200)
  // async changePassword(@Body('password') password: string, @Body('token') b64Token: string) {

  //   const token = Buffer.from(b64Token, 'base64').toString('ascii');
  //   const validToken = await this.authService.validateRecoverToken(token);
  //   if (!validToken) {
  //     throw new HttpException('El token no es válido', HttpStatus.BAD_REQUEST);
  //   }

  //   const user = await this.userService.findOne(validToken.sub);
  //   if (!user) {
  //     throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
  //   }

  //   try {
  //     await User.update(user.id, {
  //       password
  //     });
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }

  //   return user;
  // }
}
