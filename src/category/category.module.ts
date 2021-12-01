import { Module } from '@nestjs/common';
import { CategoryController } from './security.controller';
import { CategoryService } from './security.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'category', schema: CategorySchema }
      
    ]),
    ConfigModule
  ],
  controllers: [CategoryController],
  providers: [CategoryService, SendEmailMiddleware],
  exports:[CategoryService]
})
export class CategoryModule {}
