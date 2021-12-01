import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsSchema } from './settings.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'settings', schema: SettingsSchema }
      
    ]),
    ConfigModule
  ],
  controllers: [SettingsController],
  providers: [SettingsService, SendEmailMiddleware],
  exports:[SettingsService]
})
export class SettingsyModule {}
