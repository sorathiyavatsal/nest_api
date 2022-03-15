import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreCommissionController } from './store-commission.controller';
import { StoreCommissionSchema } from './store-commission.model';
import { StoreCommissionService } from './store-commission.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'StoreCommission', schema: StoreCommissionSchema }]),
  ],
  controllers: [StoreCommissionController],
  providers: [StoreCommissionService],
})
export class StoreCommissionModule {}
