import { Module } from '@nestjs/common';
import { HolidaysController } from './holiday.controller';
import { HolidaysService } from './holiday.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaysSchema } from './holiday.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Holidays', schema: HolidaysSchema }]),
    ConfigModule,
  ],
  controllers: [HolidaysController],
  providers: [HolidaysService, SendEmailMiddleware],
  exports: [HolidaysService],
})
export class HolidaysModule {}
