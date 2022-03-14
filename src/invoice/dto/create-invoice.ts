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

export class InvoiceDistanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PAID', 'REFUND', 'REPLACEMENT'] })
  invoiceStatus: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['CARD', 'UPI'] })
  method: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  transationId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paymentGatewayId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PENDDING', 'SUCCESS', 'FAILED'] })
  paymentGatewayStatus: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  paidId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['CONSUMER', 'MERCHANT'] })
  paidBy: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  receiveId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['DELIVERYBOY', 'MARCHANT'] })
  receiceBy: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: Number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  charges: Number;
}
