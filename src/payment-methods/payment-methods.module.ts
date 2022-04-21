import { Module } from '@nestjs/common';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import { RazorpayModule } from 'nestjs-razorpay';
import { PaymentMethodsSchema } from './payment-methods.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDetailsSchema } from './paymentDetails.model';

@Module({
  imports: [
    RazorpayModule.forRoot({
      key_id: 'rzp_test_4aoBIKoJPtVSGw',
      key_secret: 'DBVQ2ENouLXhUvgzSEMpp4qw',
    }),
    MongooseModule.forFeature([{ name: 'PaymentMethods', schema: PaymentMethodsSchema }]),
    MongooseModule.forFeature([{ name: 'PaymentDetails', schema: PaymentDetailsSchema }])
  ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
