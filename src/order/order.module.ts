import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/user.model';
import { catalogueSchema } from 'src/catalogue/catalogue.model';
import { ProductSchema } from 'src/product/product.model';
import { UserDataSchema } from 'src/user-data/user-data.model';
import { OrderController } from './order.controller';
import { PruchaseOrderSchema } from './order.model';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PruchaseOrder', schema: PruchaseOrderSchema }]),
    MongooseModule.forFeature([{ name: 'catalogue', schema: catalogueSchema }]),
    MongooseModule.forFeature([{ name: 'Products', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'UserData', schema: UserDataSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
