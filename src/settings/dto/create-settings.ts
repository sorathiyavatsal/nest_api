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
 
  metaKey: String
  metaValue: Array<object>
}
