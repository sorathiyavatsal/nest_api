import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementsController } from './settlements.controller';
import { SettlementSchema } from './settlements.model';
import { SettlementsService } from './settlements.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Settlement', schema: SettlementSchema }]),
  ],
  controllers: [SettlementsController],
  providers: [SettlementsService],
})
export class SettlementsModule {}
