import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
  } from 'class-validator';
  import { ApiProperty, ApiParam } from '@nestjs/swagger';
  import { ObjectId } from 'mongoose';
  
  export class OrderDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: [ 'PRODUCT', 'FLEET' ] })
    orderType: String;
  
    @IsDate()
    @IsNotEmpty()
    @ApiProperty()
    orderDate: Date;
  
    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    orders: [{
        id: String,
        quantity: Number,
        sellPrice: Number,
        discount: {
            type: String,
            vakue: Number
        }
    }];
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    subTotal: Number;
  
    @IsObject()
    @IsNotEmpty()
    @ApiProperty()
    tax: {
      type: String;
      value: Number;
    };
  
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
    @ApiProperty()
    shippingId: ObjectId;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    paymentTransactionId: String;
  }
  