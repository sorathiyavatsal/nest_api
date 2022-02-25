import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class DeliveryChargesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Goods _id' })
  category: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  weight: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  packages: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  distenance: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  weather: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  traffic: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  zipcode: number;
}
