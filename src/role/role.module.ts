import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSchema } from './role.model';
import { ConfigModule } from '../core/config/config.module';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    ConfigModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, SendEmailMiddleware],
  exports: [RoleService],
})
export class RoleModule {}
