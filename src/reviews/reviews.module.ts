import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { reviewsSchema } from './reviews.model';
import { ProductSchema } from 'src/product/product.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
@Module({
    
  imports: [
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'reviews', schema: reviewsSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
