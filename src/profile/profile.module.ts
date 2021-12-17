import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './profile.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema }
      
      
    ]),
    ConfigModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, SendEmailMiddleware],
  exports:[ProfileService]
})
export class ProfileModule {}
