import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../../environments/environment';
import { CompanyModule } from '../admin/company';
import { UsersModule } from '../admin/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MailerModule,
    PassportModule,
    JwtModule.register({
      secret: environment.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
    CompanyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule { }
