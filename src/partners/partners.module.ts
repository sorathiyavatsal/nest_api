import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { UserSchema } from 'src/auth/user.model';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
})
export class PartnersModule {}
