import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiParam } from '@nestjs/swagger';

export class EditWeightsDto {
  @IsString()
  @ApiProperty()
  category: string;

  @IsNumber()
  @ApiProperty()
  from_weight: number;

  @IsNumber()
  @ApiProperty()
  to_weight: number;

  @IsNumber()
  @ApiProperty()
  rate: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  activeStatus: boolean;
}
