import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CompanyModule } from '../admin/company/company.module';
import { UsersModule } from '../admin/users/users.module';
import { TravelsModule } from '../travels';
import { TravelStatus, TravelStatusSchema } from '../travels/schemas/travel-status.schema';
import { AuthRegisterService } from './auth-register.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MailerModule,
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    CompanyModule,
    TravelsModule,
    MongooseModule.forFeature([
      { name: TravelStatus.name, schema: TravelStatusSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, AuthRegisterService],
})
export class AuthModule { }
