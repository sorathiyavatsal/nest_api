import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/user.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { catalogueSchema } from 'src/catalogue/catalogue.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    MongooseModule.forFeature([{ name: 'catalogue', schema: catalogueSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
