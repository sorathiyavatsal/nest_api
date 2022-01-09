import { ProfileSchema } from './../profile/profile.model';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { HolidaysSchema } from '../holiday/holiday.model';
import { Module } from '@nestjs/common';
import { DeliveryFleetController } from '../delivery_fleet/deliveryfleet.controller';
import { DeliveryFleetService } from '../delivery_fleet/deliveryfleet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryFleetSchema } from '../delivery_fleet/deliveryfleet.model';
import { WeightsSchema } from '../weight/weight.model';
import { CategorySchema } from '../category/category.model';
import { PackagesSchema } from '../packages/packages.model';
import { SettingsSchema } from '../settings/settings.model';
import { PackagingsSchema } from '../packaging/packaging.model';
import { ConfigModule } from '../core/config/config.module';
import { HolidaysModule } from 'src/holiday/holiday.module';
import { UserSchema } from 'src/auth/user.model';
import { DeliveryLocationSchema } from '../delivery_fleet/deliveryLocation.model';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
import { UserVerificationSchema } from 'src/core/models/userVerification.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeliveryFleet', schema: DeliveryFleetSchema },
      { name: 'Holidays', schema: HolidaysSchema},
      { name: 'Weights', schema: WeightsSchema},
      { name: 'Packages', schema: PackagesSchema},
      { name: 'Profile', schema: ProfileSchema},
      { name: 'Category', schema: CategorySchema},
      { name: 'Packagings', schema: PackagingsSchema},
      { name: 'Settings', schema: SettingsSchema},
      { name : 'User', schema:UserSchema},
      { name : 'UserVerification', schema:UserVerificationSchema},
      { name : 'DeliveryLocation', schema:DeliveryLocationSchema}
    ]),
    ConfigModule,
    HolidaysModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService,SendEmailMiddleware],
  exports:[DashboardService]
})
export class DashboardModule {}

