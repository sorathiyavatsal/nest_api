import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoginSchema } from 'src/core/models/userLogin.model';
import { UserSchema } from 'src/auth/user.model';
import { SettingsSchema } from '../settings/settings.model';
import { NotificationGateway } from './push-notification.gateway'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Settings', schema: SettingsSchema },
      { name: 'Users', schema: UserSchema },
      { name: 'UserLogin', schema: UserLoginSchema }
    ]),
    NotificationGateway
  ],
  controllers: [],
  providers: [],
})
export class PushNotificationModule { }
