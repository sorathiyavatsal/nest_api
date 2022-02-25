import { Module } from '@nestjs/common';
import { FleetCommissionController } from './fleet-commission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetCommissionService } from './fleet-commission.service';
import { FleetCommissionSchema } from './fleet-commission.model';
import { ConfigModule } from '../core/config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FleetCommission', schema: FleetCommissionSchema },
    ]),
    ConfigModule,
  ],
  providers: [FleetCommissionService],
  controllers: [FleetCommissionController],
  exports: [FleetCommissionService],
})
export class FleetCommissionModule {}
