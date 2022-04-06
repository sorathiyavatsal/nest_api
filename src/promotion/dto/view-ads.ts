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

//This is the body of API that we will put data into
export class CreateViewAdsDto {
  @IsString()
  @ApiProperty({ enum: ['MOBILE', 'WEB'] })
  device: string;

  @IsObject()
  @ApiProperty()
  deviceInformation: Object;

  @IsString()
  @ApiProperty()
  ipaddress: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  promotionId: string;

  @IsNumber()
  @ApiProperty()
  adsId: string;
}
