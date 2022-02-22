import { DeliveryFleetModule } from '../delivery_fleet/deliveryfleet.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../core/config/config.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DeliveryController } from './delivery.controller';
import { UserLoginSchema } from 'src/core/models/userLogin.model';
import { UserVerificationSchema } from 'src/core/models/userVerification.model';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '../core/config/config.service';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { ApiKeyStrategy } from './auth-header-api-key.strategy';
import { SecurityModule } from 'src/security/security.module';
import { DeliveryFleetSchema } from 'src/delivery_fleet/deliveryfleet.model';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserVerification', schema: UserVerificationSchema },
      { name: 'UserLogin', schema: UserLoginSchema },
      { name: 'DeliveryFleet', schema: DeliveryFleetSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    SecurityModule,
    DeliveryFleetModule,
    UsersModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, SendEmailMiddleware, ApiKeyStrategy],
  controllers: [AuthController, DeliveryController],
  exports: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}
