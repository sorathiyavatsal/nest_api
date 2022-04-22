import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiParam, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class EarningDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  JobId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deliveryBoyId: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  workedHours: String;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  travelledKMs: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  startDateTime: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  endDateTime: String;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  settlmentId: String;
}
