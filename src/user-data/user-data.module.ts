import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/user.model';
import { UserDataController } from './user-data.controller';
import { UserDataSchema } from './user-data.model';
import { UserDataService } from './user-data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    ConfigModule,
  ],
  controllers: [UserDataController],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
