import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EarningsController } from './earnings.controller';
import { EarningSchema } from './earnings.model';
import { EarningsService } from './earnings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Earning', schema: EarningSchema }]),
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule {}
