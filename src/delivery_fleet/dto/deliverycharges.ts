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
  @IsNumber()
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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  weather: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  traffic: boolean;
}
