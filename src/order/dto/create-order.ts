import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiParam, ApiExtraModels } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class discount {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PERCENTAGE', 'FLAT'] })
  type: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: Number;
}

export class OrdersTest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quantity: Number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sellPrice: Number;

  @IsObject()
  @ApiProperty({ type: discount })
  @IsNotEmpty()
  Discount: Object;
}

export class tax {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PERCENTAGE', 'FLAT'] })
  type: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: Number;
}

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  consumerId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PRODUCT', 'FLEET'] })
  orderType: String;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  orderDate: Date;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, type: OrdersTest })
  orders: [];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  subTotal: Number;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ type: tax })
  tax: Object;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  copouns: [];

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  shipingAddress: Object;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  billingAddress: Object;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Delivery Fleet Id',
  })
  shippingId: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  cor: Number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentTransactionId: String;
}
