import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoriesSchema } from './category.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: CategoriesSchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
