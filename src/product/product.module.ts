import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductSchema } from './product.model';
import { ProductService } from './product.service';
import { metaDataSchema } from './metaData.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'metaData', schema: metaDataSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
