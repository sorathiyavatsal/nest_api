import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { SecurityModule } from './security/security.module';
import { CategoryModule } from './category/category.module';
import { WeightsModule } from './weight/weight.module';
import { PackagesModule } from './packages/packages.module';
import { PackagingsModule } from './packaging/packaging.module';
import { HolidaysModule } from './holiday/holiday.module';
import { SettingsyModule } from './settings/settings.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { join } from 'path';
import { AuthMiddleware } from './auth/auth.middleware';
import { InvoiceModule } from './invoice/invoice.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    MulterModule.register({
      dest: './public/uploads',
    }),
    ConfigModule,
    MailerModule.forRoot({
      transport:
        'smtps://leslin@southsoft.co.in:VUdF1oTp8zW@smtp.hostinger.com',
      defaults: {
        from: '"Byecom" <leslin@southsoft.co.in>',
      },
      template: {
        dir: join(__dirname, 'mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://localhost:27017/${configService.get(
          'DB_NAME',
        )}?retryWrites=true&w=majority`,
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    WinstonModule,
    UsersModule,
    TemplatesModule,
    SecurityModule,
    WeightsModule,
    InvoiceModule,
    CategoryModule,
    WeightsModule,
    PackagesModule,
    PackagingsModule,
    HolidaysModule,
    SettingsyModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
  static port: number | string;
  constructor(private _configService: ConfigService) {
    AppModule.port = this._configService.get('PORT');
    console.log('AppModule.port', AppModule.port);
  }
}
