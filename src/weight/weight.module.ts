import { Module } from '@nestjs/common';
import { WeightsController } from './weight.controller';
import { WeightsService } from './weight.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeightsSchema } from './weight.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Weights', schema: WeightsSchema }
      
    ]),
    ConfigModule
  ],
  controllers: [WeightsController],
  providers: [WeightsService, SendEmailMiddleware],
  exports:[WeightsService]
})
export class WeightsModule {}
