import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiParam, ApiExtraModels, ApiPropertyOptional } from '@nestjs/swagger';
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
  productId: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  variantId: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeId: String;

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

//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty({ enum: ['PRODUCT', 'FLEET'] })
//   orderStatus: String;

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
  @ApiPropertyOptional({ type: tax })
  tax: Object;

  @IsArray()
  @IsNotEmpty()
  @ApiPropertyOptional()
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
  @ApiPropertyOptional({
    description: 'Delivery Fleet Id',
  })
  shippingId: String;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
      enum: ["Pendding", "Ordering", "Prepering", "Complete"]
  })
  status: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  cor: Number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentTransactionId: String;
}
