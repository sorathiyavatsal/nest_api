import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema} from '../auth/user.model';
import { ProfileSchema } from 'src/profile/profile.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Profile', schema: ProfileSchema }
    ]),
    ConfigModule
  ],
  providers: [UsersService,SendEmailMiddleware],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
