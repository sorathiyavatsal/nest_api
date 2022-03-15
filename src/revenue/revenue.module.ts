import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RevenueController } from './revenue.controller';
import { RevenueSchema } from './revenue.model';
import { RevenueService } from './revenue.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Revenue', schema: RevenueSchema }]),
  ],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
