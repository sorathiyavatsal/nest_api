import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '../core/config/config.module';
import { CouponsSchema } from './coupons.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Coupons', schema: CouponsSchema }]),
    ConfigModule,
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
