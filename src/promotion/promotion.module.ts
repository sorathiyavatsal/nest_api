import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { ConfigModule } from '../core/config/config.module';
import { PromotionSchema } from './promotion.schema';
import { AdsSchema } from './ads.schema';
import { AdsViewSchema } from './adsView.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Promotion', schema: PromotionSchema }]),
    MongooseModule.forFeature([{ name: 'Ads', schema: AdsSchema }]),
    MongooseModule.forFeature([{ name: 'AdsView', schema: AdsViewSchema }]),
    ConfigModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService],
})
export class PromotionModule {}
