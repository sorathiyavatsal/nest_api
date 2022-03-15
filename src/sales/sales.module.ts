import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesController } from './sales.controller';
import { SalesSchema } from './sales.model';
import { SalesService } from './sales.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sales', schema: SalesSchema }]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
