import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from 'nest-router';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin';
import { AuthModule } from './modules/auth';
import { TravelsModule } from './modules/travels';
import { WorkshopModule } from './modules/workshop';
import { routes } from './routes';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    TravelsModule,
    WorkshopModule,
    RouterModule.forRoutes(routes),
    MongooseModule.forRoot('mongodb://localhost/tms-nx'),
    // MongooseModule.forFeatureAsync([
    //   {
    //     imports: [],
    //     name: User.name,
    //     useFactory: () => {
    //       const schema = UserSchema;
    //       schema.pre('save', () => console.log('Hello from pre save'));
    //       return schema;
    //     },
    //   },
    // ]),
    MailerModule.forRoot({
      transport: {
        host: 'mail.bits404.com',
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: "fernando.veloz@bits404.com",
          pass: "pkd7W*Tv0EerXD!&Ihk6v7Wr8HJgD5h%",
        },
      },
      defaults: {
        from: '"dcompas" <fernando.veloz@bits404.com>',
      },
      template: {
        dir: process.cwd() + '/apps/api/email-templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
