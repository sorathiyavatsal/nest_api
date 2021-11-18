import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SecuritySchema } from './security.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Security', schema: SecuritySchema }
      
    ]),
    ConfigModule
  ],
  controllers: [SecurityController],
  providers: [SecurityService, SendEmailMiddleware],
  exports:[SecurityService]
})
export class SecurityModule {}
