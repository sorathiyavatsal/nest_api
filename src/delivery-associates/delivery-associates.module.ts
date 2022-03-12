import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UserSchema } from 'src/auth/user.model';
import { DeliveryFleetSchema } from 'src/delivery_fleet/deliveryfleet.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { UsersModule } from 'src/users/users.module';
import { DeliveryAssociatesController } from './delivery-associates.controller';
import { DeliveryAssociatesService } from './delivery-associates.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserData', schema: UserDataSchema },
      { name: 'DeliveryFleet', schema: DeliveryFleetSchema },
    ]),
  ],
  controllers: [DeliveryAssociatesController],
  providers: [DeliveryAssociatesService]
})
export class DeliveryAssociatesModule {}
