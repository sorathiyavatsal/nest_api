import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OtpVerifyCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  code: string;
}
