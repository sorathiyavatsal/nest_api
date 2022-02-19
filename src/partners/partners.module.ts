import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { PartnersSchema } from './partners.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Partners', schema: PartnersSchema }]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
