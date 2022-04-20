import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiParam,
  ApiExtraModels,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class UpdateOrderDto {
  @IsObject()
  @IsNotEmpty()
  @ApiPropertyOptional()
  shipingAddress: Object;

  @IsObject()
  @IsNotEmpty()
  @ApiPropertyOptional()
  billingAddress: Object;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    enum: ['PENDING', 'PROCESSING', 'DISPATCH', 'COMPLETE'],
  })
  status: String;
}
