import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoginSchema } from 'src/core/models/userLogin.model';
import { UserSchema } from 'src/auth/user.model';
import { SettingsSchema } from '../settings/settings.model';
import { DeliveryFleetSchema } from '../delivery_fleet/deliveryfleet.model';
import { SocketGateway } from './sockets.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeliveryFleet', schema: DeliveryFleetSchema },
      { name: 'Settings', schema: SettingsSchema },
      { name: 'Users', schema: UserSchema },
      { name: 'UserLogin', schema: UserLoginSchema },
    ]),
    SocketGateway,
  ],
  controllers: [],
  providers: [],
})
export class SocketModule {}
