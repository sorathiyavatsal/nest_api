import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoriesSchema } from './category.model';
import { ProductSchema } from 'src/product/product.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: CategoriesSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
