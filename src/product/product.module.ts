import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { VariantSchema } from './variant.model';
import { VariantOptionsSchema } from './variantOptions.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Variant', schema: VariantSchema }]),
    MongooseModule.forFeature([{ name: 'VariantOptions', schema: VariantOptionsSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
