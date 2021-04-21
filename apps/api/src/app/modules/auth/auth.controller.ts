import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../core/decorators';
import { EmailTemplate } from '../../core/enums';
import { DbTransactionInterceptor } from '../../core/interceptors';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { stringToMongoId } from '../../core/utils';
import { CompanyService } from '../admin/company/company.service';
import { CreateCompanyDto } from '../admin/company/dto/create-company.dto';
import { CreateUserDto } from '../admin/users/dto/create-user.dto';
import { UserDto } from '../admin/users/dto/user.dto';
import { UsersService } from '../admin/users/users.service';
import { AuthRegisterService } from './auth-register.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('')
export class AuthController {

  constructor(
    private authService: AuthService,
    private registerService: AuthRegisterService,
    private userService: UsersService,
    private companyService: CompanyService,
    private readonly mailerService: MailerService,
  ) { }

  @Post('token')
  @HttpCode(200)
  @UseInterceptors(DbTransactionInterceptor)
  async token(@Body('refreshToken') refreshToken) {

    const payload = this.authService.decodeRefreshToken(refreshToken);
    if (!payload) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const user = await this.userService.findOne(payload.sub, { company: payload.company });
    if (!user || user.refreshToken !== refreshToken) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken } = this.authService.getJwtTokens(payload.sub, payload.email, payload.company);
    return { accessToken };
  }

  @Post('register')
  @UseInterceptors(DbTransactionInterceptor)
  async register(@Body('company') createCompanyDto: CreateCompanyDto, @Body('user') createUserDto: CreateUserDto, @GetHttpOptions('session') session) {
    const company = await this.companyService.create(createCompanyDto, { session });
    if (!company.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    createUserDto.company = company.id;
    const user = await this.userService.create(createUserDto, { session });
    if (!user.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    await this.registerService.createDefaultTravelStatus({ company: company.id, session });
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
    return this.authService.logout(req.userId ? stringToMongoId(req.userId) : null, req.company || null);
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
  @UseInterceptors(new TransformInterceptor(UserDto))
  async changePassword(@Body('password') password: string, @Body('token') b64Token: string) {

    const token = Buffer.from(b64Token, 'base64').toString('ascii');
    const validToken = await this.authService.validateRecoverToken(token);
    if (!validToken) {
      throw new HttpException('El token no es válido', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findOne(validToken.sub, { company: validToken.company });
    if (!user) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    try {
      const userUpdated = await this.userService.partialUpdate(user.id, {
        password
      }, { company: validToken.company });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserByToken(@Request() req) {
    return await this.userService.findOne(req.user.userId, { company: req.user.company });
  }
}
