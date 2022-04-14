import { Module } from '@nestjs/common';
import { FleetCommissionController } from './fleet-commission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetCommissionService } from './fleet-commission.service';
import { FleetCommissionSchema } from './fleet-commission.model';
import { ConfigModule } from '../core/config/config.module';
import { UserDataSchema } from 'src/user-data/user-data.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FleetCommission', schema: FleetCommissionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    ConfigModule,
  ],
  providers: [FleetCommissionService],
  controllers: [FleetCommissionController],
  exports: [FleetCommissionService],
})
export class FleetCommissionModule {}
