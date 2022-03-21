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

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['PROMOTIONAL', 'GENERAL'] })
  type: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: [
      'NEW FLEET REQUEST',
      'FLEET ASSIGNED',
      'FLEET VERIFICATION',
      'FLEET PROCESSED',
      'FLEET COMPELETION',
    ],
  })
  operation: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deviceId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  title: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  content: String;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ enum: ['SEND', 'RECEIVE', 'VIEW', 'REMOVE'] })
  status: String;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  extraData: Object;
}
