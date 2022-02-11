import { HolidaysSchema } from './../holiday/holiday.model';
import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceSchema } from './invoice.model';
import { ConfigModule } from '../core/config/config.module';
import { HolidaysModule } from 'src/holiday/holiday.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Invoice', schema: InvoiceSchema },
      { name: 'Holidays', schema: HolidaysSchema },
    ]),
    ConfigModule,
    HolidaysModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, SendEmailMiddleware],
  exports: [InvoiceService],
})
export class InvoiceModule {}
