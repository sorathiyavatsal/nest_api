import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class EditSettingsDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  delivery_service_array: [];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  'delivery_service_array.zip_code': string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  'delivery_service_array.state_name': string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  'delivery_service_array.city': string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  'delivery_service_array.active': boolean;
}
