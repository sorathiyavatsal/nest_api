import { Module } from '@nestjs/common';
import { FleetCommissionController } from './fleet-commission.controller';
import { FleetCommissionService } from './fleet-commission.service';

@Module({
  controllers: [FleetCommissionController],
  providers: [FleetCommissionService],
})
export class FleetCommissionModule {}
