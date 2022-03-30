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

export class userDutyStatusDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  liveStatus: boolean;
}
