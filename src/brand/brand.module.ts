import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/product/product.model';
import { BrandController } from './brand.controller';
import { BrandsSchema } from './brand.model';
import { BrandService } from './brand.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Brands', schema: BrandsSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
