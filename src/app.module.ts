import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { UsersModule } from './users/users.module';
import { TemplatesModule } from './templates/templates.module';
import { SecurityModule } from './security/security.module';
import { WeightsModule } from './weight/weight.module';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { PackagesModule } from './packages/packages.module';
import { PackagingsModule } from './packaging/packaging.module';
import { HolidaysModule } from './holiday/holiday.module';
import { SettingsyModule } from './settings/settings.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { join } from 'path';
import { AuthMiddleware } from './auth/auth.middleware';
import { DeliveryFleetModule } from './delivery_fleet/deliveryfleet.module';
import { MulterModule } from '@nestjs/platform-express';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { CouponsModule } from './coupons/coupons.module';
import { PromotionModule } from './promotion/promotion.module';
import { PartnersModule } from './partners/partners.module';
import { SettlementsModule } from './settlements/settlements.module';
import { FleetCommissionModule } from './fleet-commission/fleet-commission.module';
import { StoreModule } from './store/store.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { GoodsModule } from './goods/goods.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { TaxModule } from './tax/tax.module';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserDataModule } from './user-data/user-data.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { ReviewsModule } from './reviews/reviews.module';
@Module({
  imports: [
    MulterModule.register({
      dest: './public/uploads',
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    MailerModule.forRoot({
      transport:
        'smtps://support@byecom.in:4EmH>&D*@smtp.gmail.com',
      defaults: {
        from: '"Byecom" <support@byecom.in>',
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
        uri: `mongodb+srv://byecom:!7xGYc7wYRyeCN7@cluster0.hzuwh.mongodb.net/${configService.get(
          'DB_NAME',
        )}?retryWrites=true&w=majority`,
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    WinstonModule,
    UsersModule,
    RoleModule,
    ProfileModule,
    TemplatesModule,
    SecurityModule,
    WeightsModule,
    DeliveryFleetModule,
    WeightsModule,
    PackagesModule,
    PackagingsModule,
    HolidaysModule,
    SettingsyModule,
    DashboardModule,
    AdminModule,
    CouponsModule,
    PromotionModule,
    PartnersModule,
    SettlementsModule,
    FleetCommissionModule,
    StoreModule,
    BrandModule,
    ProductModule,
    GoodsModule,
    CategoryModule,
    CouponsModule,
    PromotionModule,
    OrderModule,
    TaxModule,
    PushNotificationModule,
    UserDataModule,
    CatalogueModule,
    ReviewsModule,
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
