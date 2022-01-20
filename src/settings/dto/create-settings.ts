import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class CreateSettingsDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  delivery_service_array: [];
}
