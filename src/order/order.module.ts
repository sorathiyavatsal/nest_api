import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/user.model';
import { catalogueSchema } from 'src/catalogue/catalogue.model';
import { NotificationSchema } from 'src/notification/notification.model';
import { ProductSchema } from 'src/product/product.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { OrderController } from './order.controller';
import { PruchaseOrderSchema } from './order.model';
import { OrderService } from './order.service';
import { SellOrderSchema } from './sellorder.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PurchaseOrder', schema: PruchaseOrderSchema }]),
    MongooseModule.forFeature([{ name: 'SellOrder', schema: SellOrderSchema }]),
    MongooseModule.forFeature([{ name: 'catalogue', schema: catalogueSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
    MongooseModule.forFeature([
        { name: 'Notification', schema: NotificationSchema },
      ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
