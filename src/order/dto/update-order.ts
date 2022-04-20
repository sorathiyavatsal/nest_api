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
  @ApiProperty()
  shipingAddress: Object;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  billingAddress: Object;

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    enum: ['Pendding', 'Ordering', 'Prepering', 'Complete'],
  })
  status: String;
}
