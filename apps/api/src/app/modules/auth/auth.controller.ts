import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { EmailTemplate } from '../../core/enums';
import { CompanyService, CreateCompanyDto } from '../admin/company';
import { CreateUserDto, UsersService } from '../admin/users';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private companyService: CompanyService,
    private readonly mailerService: MailerService,
  ) { }

  @Post('token')
  @HttpCode(200)
  async token(@Body('refreshToken') refreshToken) {

    const payload = this.authService.decodeRefreshToken(refreshToken);
    if (!payload) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const user = await this.userService.findOne(payload.sub);
    if (!user || user.refreshToken !== refreshToken) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken } = this.authService.getJwtTokens(payload.sub, payload.email, payload.companyId);
    return { accessToken };
  }

  @Post('register')
  async register(@Body('company') createCompanyDto: CreateCompanyDto, @Body('user') createUserDto: CreateUserDto) {

    const company = await this.companyService.create(createCompanyDto);
    if (!company.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    createUserDto.company = company.id;
    const user = await this.userService.create(createUserDto);
    if (!user.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    return;
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Request() req) {
    return this.authService.logout(req.userId || null);
  }

  @Post('recover-password')
  @HttpCode(200)
  async recoverPassword(@Body('email') email) {

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('No se encontró el usuario', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.generateRecoverToken(user);
    const b64Token = Buffer.from(token).toString('base64');
    const b64Email = Buffer.from(email).toString('base64');

    return await this.mailerService.sendMail({
      to: email,
      subject: 'Recupera tu contraseña',
      template: EmailTemplate.RECOVER_PASSWORD, // The `.pug` or `.hbs` extension is appended automatically.
      context: {  // Data to be sent to template engine.
        token: b64Token,
        email: b64Email
      },
    });
  }

  @Post('change-password')
  @HttpCode(200)
  async changePassword(@Body('password') password: string, @Body('token') b64Token: string) {

    const token = Buffer.from(b64Token, 'base64').toString('ascii');
    const validToken = await this.authService.validateRecoverToken(token);
    if (!validToken) {
      throw new HttpException('El token no es válido', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne(validToken.sub);
    if (!user) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    try {
      const userUpdated = await this.userService.partialUpdate(user.id, {
        password
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
