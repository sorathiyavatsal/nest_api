import { Module } from '@nestjs/common';
import { PackagingsController } from './packaging.controller';
import { PackagingsService } from './packaging.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagingsSchema } from './packaging.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Packagings', schema: PackagingsSchema },
    ]),
    ConfigModule,
  ],
  controllers: [PackagingsController],
  providers: [PackagingsService, SendEmailMiddleware],
  exports: [PackagingsService],
})
export class PackagingsModule {}
