import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { PartnersSchema } from './partners.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Partners', schema: PartnersSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
