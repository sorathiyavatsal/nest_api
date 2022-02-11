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

export class locationUpdateDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lng: number;
}
