import { Module } from '@nestjs/common';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GoodsSchema } from './goods.model';
import { WeightsSchema } from 'src/weight/weight.model';
import { PackagesSchema } from 'src/packages/packages.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: GoodsSchema },
      { name: 'Weights', schema: WeightsSchema },
      { name: 'Packages', schema: PackagesSchema },
      
    ]),
    ConfigModule
  ],
  controllers: [GoodsController],
  providers: [GoodsService, SendEmailMiddleware],
  exports:[GoodsService]
})
export class GoodsModule {}
