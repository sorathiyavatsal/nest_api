import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { PurchaseInvoiceSchema } from './invoice.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PurchaseInvoice', schema: PurchaseInvoiceSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
