import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiParam, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingsDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  delivery_service_array: Array<object>;

  @IsString()
  @ApiPropertyOptional({
    description:'this is just testing',
  })
  meta_value:string;
}
