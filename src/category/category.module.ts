import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.model';
import { WeightsSchema } from 'src/weight/weight.model';
import { PackagesSchema } from 'src/packages/packages.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Weights', schema: WeightsSchema },
      { name: 'Packages', schema: PackagesSchema },
      
    ]),
    ConfigModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService, SendEmailMiddleware],
  exports:[CategoryService]
})
export class CategoryModule {}
