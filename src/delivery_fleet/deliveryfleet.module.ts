import { HolidaysSchema } from '../holiday/holiday.model';
import { Module } from '@nestjs/common';
import { DeliveryFleetController } from './deliveryfleet.controller';
import { DeliveryFleetService } from './deliveryfleet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryFleetSchema } from './deliveryfleet.model';
import { WeightsSchema } from '../weight/weight.model';
import { CategorySchema } from '../category/category.model';
import { PackagesSchema } from '../packages/packages.model';
import { SettingsSchema } from '../settings/settings.model';
import { PackagingsSchema } from '../packaging/packaging.model';
import { ConfigModule } from '../core/config/config.module';
import { HolidaysModule } from 'src/holiday/holiday.module';
import { UserSchema } from 'src/auth/user.model';
import { SendEmailMiddleware } from '../core/middleware/send-email.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeliveryFleet', schema: DeliveryFleetSchema },
      { name: 'Holidays', schema: HolidaysSchema},
      { name: 'Weights', schema: WeightsSchema},
      { name: 'Packages', schema: PackagesSchema},
      { name: 'Category', schema: CategorySchema},
      { name: 'Packagings', schema: PackagingsSchema},
      { name: 'Settings', schema: SettingsSchema},
      { name : 'User', schema:UserSchema}
    ]),
    ConfigModule,
    HolidaysModule
  ],
  controllers: [DeliveryFleetController],
  providers: [DeliveryFleetService, SendEmailMiddleware],
  exports:[DeliveryFleetService]
})
export class DeliveryFleetModule {}
