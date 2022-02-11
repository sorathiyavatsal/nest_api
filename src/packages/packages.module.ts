import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackageService } from './packages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesSchema } from './packages.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Packages', schema: PackagesSchema }]),
    ConfigModule,
  ],
  controllers: [PackagesController],
  providers: [PackageService, SendEmailMiddleware],
  exports: [PackageService],
})
export class PackagesModule {}
