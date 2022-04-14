import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { catalogueSchema } from 'src/catalogue/catalogue.model';
import { StoreCommissionController } from './store-commission.controller';
import { StoreCommissionSchema } from './store-commission.model';
import { StoreCommissionService } from './store-commission.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'StoreCommission', schema: StoreCommissionSchema }]),
    MongooseModule.forFeature([{ name: 'catalogue', schema: catalogueSchema }]),
  ],
  controllers: [StoreCommissionController],
  providers: [StoreCommissionService],
})
export class StoreCommissionModule {}
