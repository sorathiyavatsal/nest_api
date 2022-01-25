import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { ConfigModule } from '../core/config/config.module';
import { PromotionSchema } from './promotion.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Promotion', schema: PromotionSchema }]),
    ConfigModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
