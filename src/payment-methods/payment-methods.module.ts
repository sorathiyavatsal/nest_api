import { Module } from '@nestjs/common';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsService } from './payment-methods.service';
import { RazorpayModule } from 'nestjs-razorpay';

@Module({
//   imports: [
//     RazorpayModule.forRoot({
//       key_id: process.env.RAZORPAY_ID,
//       key_secret: process.env.RAZORPAY_SECRET_KEY,
//     }),
//   ],
  controllers: [PaymentMethodsController],
  providers: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
