import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConsumerData {
  @IsString()
  @ApiProperty({ enum: ['Male', 'Female', 'Other'] })
  gender: string;

  @IsNumber()
  @ApiProperty()
  age: number;

  @IsNumber()
  @ApiProperty()
  userActivity: number;

  @IsBoolean()
  @ApiProperty()
  userActivityStatus: boolean;

  @IsNumber()
  @ApiProperty()
  purchaseDays: number;

  @IsNumber()
  @ApiProperty()
  purchaseAmount: number;

  @IsString()
  @ApiProperty({ enum: ['Product', 'Category'] })
  purchaseType: string;

  @IsArray()
  @ApiProperty()
  purchase: [];
}

export class MerchantData {
  @IsNumber()
  @ApiProperty()
  shopActivity: number;

  @IsBoolean()
  @ApiProperty()
  shopActivityStatus: boolean;

  @IsNumber()
  @ApiProperty()
  orderDays: number;

  @IsNumber()
  @ApiProperty()
  orderAmount: number;

  @IsArray()
  @ApiProperty()
  shopShutter: [];
}

export class DeliveryBoyData {
  @IsNumber()
  @ApiProperty()
  dutyActivity: number;

  @IsBoolean()
  @ApiProperty()
  dutyActivityStatus: boolean;

  @IsNumber()
  @ApiProperty()
  dutyDays: number;

  @IsNumber()
  @ApiProperty()
  dutyhours: number;

  @IsNumber()
  @ApiProperty()
  pickhoursFrom: number;

  @IsNumber()
  @ApiProperty()
  pickhoursTo: number;

  @IsNumber()
  @ApiProperty()
  distanceKm: number;

  @IsNumber()
  @ApiProperty()
  distanceDays: number;
}

//This is the body of API that we will put data into
export class CreatePromotionDto {
  @IsString()
  @ApiProperty({ enum: ['MARCHANT', 'CONSUMER', 'DELIVERY BOY'] })
  network: string;

  @IsString()
  @ApiProperty({ enum: ['DISPLAY', 'NOTIFICATION', 'MESSAGE'] })
  promotionType: string;

  @IsArray()
  @ApiProperty()
  area: [];

  @IsString()
  @ApiProperty({ enum: ['MOBILE', 'WEB'] })
  device: string;

  @IsObject()
  @ApiPropertyOptional()
  consumer: ConsumerData;

  @IsObject()
  @ApiPropertyOptional()
  merchant: MerchantData;

  @IsObject()
  @ApiPropertyOptional()
  deliveryBoy: DeliveryBoyData;

  @IsString()
  @ApiProperty({ enum: ['PAGE1', 'PAGE2', 'PAGE3', 'PAGE4'] })
  page: string;

  @IsNumber()
  @ApiProperty({ enum: ['SEACTION1', 'SEACTION2', 'SEACTION3', 'SEACTION4'] })
  section: string;

  @IsString()
  @ApiProperty()
  start_date: string;

  @IsString()
  @ApiProperty()
  end_date: string;
}
