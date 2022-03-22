import { Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { catalogueSchema } from './catalogue.model';
import { ConfigModule } from '../core/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { metaDataSchema } from 'src/product/metaData.model';
import { ProductSchema } from 'src/product/product.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'metaData', schema: metaDataSchema }]),
    MongooseModule.forFeature([{ name: 'catalogue', schema: catalogueSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    ConfigModule,
  ],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})

export class CatalogueModule {}