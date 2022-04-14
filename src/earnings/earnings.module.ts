import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetCommissionSchema } from 'src/fleet-commission/fleet-commission.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { EarningsController } from './earnings.controller';
import { EarningSchema } from './earnings.model';
import { EarningsService } from './earnings.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Earning', schema: EarningSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    MongooseModule.forFeature([
        { name: 'FleetCommission', schema: FleetCommissionSchema },
      ])
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule {}
